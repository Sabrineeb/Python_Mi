import { useEffect, useState } from 'react';
import styles from './styles/formations.module.css';
import Link from 'next/link';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const res = await fetch('http://localhost:9001/formations');
        const data = await res.json();
        setFormations(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des formations :", error);
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  if (loading) return <p>Chargement des formations...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Liste des Formations</h1>

      <ul className={styles.formationList}>
        {formations.map(f => (
          <li key={f.id} className={styles.formationItem}>
            <div className={styles.formationTitle}>{f.title}</div>
            <div className={styles.formationDescription}>{f.description}</div>
            <Link href={`/inscrire/inscription-formation/${f.id}`} className={styles.btnInscrire}>
              S'inscrire
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
