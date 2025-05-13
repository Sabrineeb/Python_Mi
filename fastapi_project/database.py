from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db?timeout=30"  # timeout en secondes
  # Chemin vers la base de données

# Crée l'engin SQLite
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Crée la base
Base = declarative_base()

# Crée une session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
