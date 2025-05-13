import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '../../styles/InscriptionFormation.module.css';



export default function InscriptionFormation() {
  const router = useRouter();
  const { id } = router.query;

  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }

    if (!id) return;

    const fetchFormation = async () => {
      try {
        const res = await fetch(`http://localhost:9001/formations`);
        const data = await res.json();
        const found = data.find((f) => f.id === parseInt(id));
        setFormation(found);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement de la formation :", error);
        setLoading(false);
      }
    };

    fetchFormation();
  }, [id]);

  const handleInscription = async () => {
    if (!student) {
      alert("❌ Veuillez d'abord vous connecter.");
      return;
    }

    const payload = {
      student_id: parseInt(student.id),
      formation_id: parseInt(id)
    };

    try {
      const res = await fetch('http://localhost:9001/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("✅ Inscription réussie !");
        router.push('/formations');
      } else {
        const text = await res.text();
        alert("❌ Erreur : " + text);
      }
    } catch (error) {
      console.error("Erreur serveur :", error);
      alert("❌ Erreur serveur !");
    }
  };

  const handleAjouterFavori = async () => {
    if (!student) {
      alert("❌ Veuillez d'abord vous connecter.");
      return;
    }

    const payload = {
      studentId: parseInt(student.id),
      formationId: parseInt(id)
    };

    try {
      const res = await fetch('http://localhost:8082/api/favoris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("⭐ Formation ajoutée aux favoris !");
      } else {
        const errorText = await res.text();
        alert("❌ Erreur : " + errorText);
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout aux favoris :", err);
      alert("❌ Erreur serveur !");
    }
  };

  if (loading) return <p className={styles.loading}>Chargement...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inscription à : {formation?.title}</h1>
      <p className={styles.description}>{formation?.description}</p>
      <div className={styles.buttons}>
        <button onClick={handleInscription} className={styles.inscriptionButton}>S'inscrire</button>
        <button onClick={handleAjouterFavori} className={styles.favoriButton}>
          ⭐ Ajouter aux Favoris
        </button>
      </div>
    </div>
  );
}
