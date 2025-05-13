# main.py

from fastapi import FastAPI, Depends, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from database import SessionLocal, engine, Base
from models import DepartementModel, FormationModel, StudentModel, StudentFormation, RecommendedBook
import bcrypt
import requests
from bs4 import BeautifulSoup
import openai  # Pour les résumés intelligents

# ---------- Configuration OpenAI ----------
openai.api_key = ""  # ← Remplacer par ta propre clé API OpenAI

# ---------- Initialisation FastAPI ----------
app = FastAPI()

# ---------- Configuration CORS ----------
origins = [
    "http://localhost:3000",  # Frontend étudiant (Next.js)
    "http://localhost:4200",  # Frontend admin (Angular)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Création des tables ----------
Base.metadata.create_all(bind=engine)

# ---------- Dépendance DB ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- Schémas Pydantic ----------
class StudentSchema(BaseModel):
    nom: str
    prenom: str
    email: str
    password: str
    departement_id: int
    model_config = ConfigDict(from_attributes=True)

class DepartementSchema(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)

class FormationSchema(BaseModel):
    title: str
    description: str
    departement_id: int
    model_config = ConfigDict(from_attributes=True)

class StudentFormationLink(BaseModel):
    student_id: int
    formation_id: int

class RecommendedBookSchema(BaseModel):
    title: str
    price: float
    category: str
    availability: str

    class Config:
        orm_mode = True

# ---------- Routes Départements ----------
@app.post("/departements")
def create_departement(dep: DepartementSchema, db: Session = Depends(get_db)):
    db_dep = DepartementModel(name=dep.name)
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    return db_dep

@app.get("/departements")
def list_departements(db: Session = Depends(get_db)):
    return db.query(DepartementModel).all()

# ---------- Routes Formations ----------
@app.post("/formations")
def create_formation(form: FormationSchema, db: Session = Depends(get_db)):
    db_form = FormationModel(**form.dict())
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

@app.get("/formations")
def list_formations(db: Session = Depends(get_db)):
    return db.query(FormationModel).all()

# ---------- Routes Étudiants ----------
@app.post("/students")
def create_student(student: StudentSchema, db: Session = Depends(get_db)):
    departement = db.query(DepartementModel).filter_by(id=student.departement_id).first()
    if not departement:
        raise HTTPException(status_code=400, detail="Département non trouvé")

    if db.query(StudentModel).filter_by(email=student.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_pw = bcrypt.hashpw(student.password.encode('utf-8'), bcrypt.gensalt())

    db_student = StudentModel(
        nom=student.nom,
        prenom=student.prenom,
        email=student.email,
        password=hashed_pw.decode('utf-8'),
        departement_id=student.departement_id
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)

    return db_student

@app.get("/students/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")
    return student

@app.post("/login")
def login(data: dict = Body(...), db: Session = Depends(get_db)):
    user = db.query(StudentModel).filter_by(email=data["email"]).first()
    if not user or not bcrypt.checkpw(data["password"].encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")
    return user

# ---------- Inscriptions aux formations ----------
@app.post("/inscriptions")
def inscrire_formation(link: StudentFormationLink, db: Session = Depends(get_db)):
    existing = db.query(StudentFormation).filter_by(
        student_id=link.student_id,
        formation_id=link.formation_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Déjà inscrit à cette formation")

    inscription = StudentFormation(
        student_id=link.student_id,
        formation_id=link.formation_id
    )
    db.add(inscription)
    db.commit()
    return {"message": "Inscription réussie"}

@app.get("/students/{student_id}/formations")
def get_student_formations(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter_by(id=student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    return [ins.formation for ins in student.inscriptions]

# ---------- Scraping & Recommandation de livres ----------
@app.post("/scrape-books")
def scrape_books(db: Session = Depends(get_db)):
    url = "https://books.toscrape.com/catalogue/page-1.html"
    books = []

    while url:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        for book in soup.select(".product_pod"):
            title = book.h3.a["title"]
            price = float(book.select_one(".price_color").text[1:])
            availability = book.select_one(".instock.availability").text.strip()
            category = "Unknown"  # Améliorable avec navigation

            book_obj = RecommendedBook(
                title=title,
                price=price,
                category=category,
                availability=availability
            )
            books.append(book_obj)

        db.bulk_save_objects(books)
        db.commit()
        return {"message": f"{len(books)} livres ajoutés."}

@app.get("/recommendations", response_model=list[RecommendedBookSchema])
def get_recommendations(
    db: Session = Depends(get_db),
    category: str = Query(None),
    price_min: float = Query(None),
    price_max: float = Query(None),
):
    query = db.query(RecommendedBook)

    if category:
        query = query.filter(RecommendedBook.category.ilike(f"%{category}%"))
    if price_min is not None:
        query = query.filter(RecommendedBook.price >= price_min)
    if price_max is not None:
        query = query.filter(RecommendedBook.price <= price_max)

    return query.all()

# ---------- Résumé intelligent ----------
@app.get("/books/summary")
def summarize_book(text: str = Query(..., min_length=100)):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu es un assistant qui résume les livres."},
                {"role": "user", "content": f"Résume ce livre : {text}"}
            ]
        )
        summary = response.choices[0].message.content
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur AI : {str(e)}")
