import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import style from './style/inscription.module.css';

export default function Inscription() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departementId, setDepartementId] = useState('');
  const [departements, setDepartements] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:9001/departements")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data) => setDepartements(data))
      .catch((err) => {
        console.error("Erreur de chargement des départements:", err);
        alert("Impossible de charger les départements.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departementId) {
      alert("Veuillez choisir un département.");
      return;
    }

    const data = { nom, prenom, email, password, departement_id: parseInt(departementId) };

    try {
      const res = await fetch('http://localhost:9001/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSuccess(true);
        setNom('');
        setPrenom('');
        setEmail('');
        setPassword('');
        setDepartementId('');
        router.push('/login');
      } else {
        const error = await res.json();
        alert("Erreur : " + error.detail);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur de connexion.");
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.formTitle}>Inscription Étudiant</h1>

      {success ? (
        <p className={style.successMessage}>✅ Inscription réussie ! Redirection en cours...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={style.formGroup}>
            <input
              className={style.inputField}
              placeholder="Nom"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
            />
          </div>

          <div className={style.formGroup}>
            <input
              className={style.inputField}
              placeholder="Prénom"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              required
            />
          </div>

          <div className={style.formGroup}>
            <input
              className={style.inputField}
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={style.formGroup}>
            <input
              className={style.inputField}
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={style.formGroup}>
            <select
              className={style.selectField}
              value={departementId}
              onChange={e => setDepartementId(e.target.value)}
              required
            >
              <option value="">-- Choisir un département --</option>
              {departements.map(dep => (
                <option key={dep.id} value={dep.id}>
                  {dep.id} - {dep.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className={style.submitButton}>
            S'inscrire
          </button>
        </form>
      )}
    </div>
  );
}
