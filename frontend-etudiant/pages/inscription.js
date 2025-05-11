import { useState, useEffect } from 'react';

export default function Inscription() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departementId, setDepartementId] = useState('');
  const [departements, setDepartements] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('http://localhost:9000/departements')
      .then(res => res.json())
      .then(setDepartements);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:9000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email, password, departement_id: parseInt(departementId) })
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Inscription Étudiant</h1>
      {success ? (
        <p>✅ Inscription réussie ! Vous pouvez maintenant vous inscrire à une formation.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required /><br />
          <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required /><br />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
          <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
          <select value={departementId} onChange={e => setDepartementId(e.target.value)} required>
            <option value="informatique">-- Choisir un département --</option>
            {departements.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select><br />
          <button type="submit">S'inscrire</button>
        </form>
      )}
    </div>
  );
}
