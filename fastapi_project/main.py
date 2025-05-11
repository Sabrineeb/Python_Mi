from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from database import SessionLocal, engine, Base
from models import DepartementModel, FormationModel, StudentModel, StudentFormation
import bcrypt

app = FastAPI()

# ✅ Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4200"],  # ✅ sans espace devant
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Crée les tables dans la base de données SQLite
Base.metadata.create_all(bind=engine)

# Dépendance pour la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class Student(BaseModel):
    nom: str
    prenom: str
    email: str
    password: str
    departement_id: int
    model_config = ConfigDict(from_attributes=True)

class Departement(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)

class Formation(BaseModel):
    title: str
    description: str
    departement_id: int
    model_config = ConfigDict(from_attributes=True)

class StudentFormationLink(BaseModel):
    student_id: int
    formation_id: int

# Routes: Départements
@app.post("/departements")
def create_departement(dep: Departement, db: Session = Depends(get_db)):
    db_dep = DepartementModel(name=dep.name)
    db.add(db_dep)
    db.commit()
    db.refresh(db_dep)
    return db_dep

@app.get("/departements")
def list_departements(db: Session = Depends(get_db)):
    return db.query(DepartementModel).all()

# Routes: Formations
@app.post("/formations")
def create_formation(form: Formation, db: Session = Depends(get_db)):
    db_form = FormationModel(**form.dict())
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

@app.get("/formations")
def list_formations(db: Session = Depends(get_db)):
    return db.query(FormationModel).all()

# Routes: Étudiants
@app.post("/students")
def create_student(student: Student, db: Session = Depends(get_db)):
    try:
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

        return {
            "id": db_student.id,
            "nom": db_student.nom,
            "prenom": db_student.prenom,
            "email": db_student.email,
            "departement_id": db_student.departement_id
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/students")
def list_students(db: Session = Depends(get_db)):
    return db.query(StudentModel).all()

@app.post("/login")
def login(data: dict = Body(...), db: Session = Depends(get_db)):
    user = db.query(StudentModel).filter_by(email=data["email"]).first()
    if not user or not bcrypt.checkpw(data["password"].encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")

    return {
        "id": user.id,
        "nom": user.nom,
        "prenom": user.prenom,
        "email": user.email,
        "departement_id": user.departement_id
    }

# Routes: Inscriptions
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
