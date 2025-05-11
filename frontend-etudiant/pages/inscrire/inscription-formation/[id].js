import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function InscriptionFormation() {
  const router = useRouter();
  const { id } = router.query;  // Obtient l'ID de la formation depuis l'URL
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchFormation = async () => {
      const res = await fetch(`http://localhost:9000/formations`);
      const data = await res.json();
      const f = data.find((f) => f.id === parseInt(id));  // Recherche la formation avec l'ID
      setFormation(f);
      setLoading(false);
    };
    fetchFormation();
  }, [id]);

  const handleInscription = async () => {
    const student = JSON.parse(localStorage.getItem('student'));
    if (!student) {
      alert("Vous devez être connecté pour vous inscrire");
      return;
    }

    const res = await fetch(`http://localhost:9000/inscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: student.id, formation_id: parseInt(id) }),
    });

    if (res.ok) {
      alert("Inscription réussie!");
      router.push('/formations');
    } else {
      alert("Erreur lors de l'inscription");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Inscription à : {formation?.title}</h1>
      <p>{formation?.description}</p>
      <button onClick={handleInscription}>S'inscrire</button>
    </div>
  );
}
