import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      const res = await fetch('http://localhost:9000/formations');
      const data = await res.json();
      setFormations(data);
      setLoading(false);
    };
    fetchFormations();
  }, []);

  if (loading) return <p>Chargement des formations...</p>;

  return (
    <div>
      <h1>Liste des Formations</h1>
      <ul>
        {formations.map((f) => (
          <li key={f.id}>
            <strong>{f.title}</strong> — {f.description}<br />
          <Link href={`/inscrire/inscription-formation/${f.id}`}>S'inscrire</Link>

          </li>
        ))}
      </ul>
    </div>
  );
}
