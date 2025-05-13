import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/login.module.css'; // Assure-toi que le chemin est correct

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('student', JSON.stringify(data));
        router.push('/formations');
      } else {
        const data = await response.json();
        setError(data.detail || 'Erreur de connexion');
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.loginTitle}>Connexion</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.loginButton}>Se connecter</button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.signupLink}>
        Vous n'avez pas de compte ? <a href="/inscription">S'inscrire</a>
      </div>
    </div>
  );
}
