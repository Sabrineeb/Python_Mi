import Head from 'next/head';
import styles from './styles/home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Page d’accueil - Formations</title>
      </Head>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Bienvenue sur notre plateforme</h1>
          <p className={styles.subtitle}>Explorez nos formations et développez vos compétences.</p>
          <a href="/services" className={styles.buttonPrimary}>Découvrir nos services</a>
          <a href="/recommendations" className="mr-4">📚 Recommandations</a>
          <a href="/book-summary" className="mr-4">🧠 Résumé intelligent</a>

        </header>


        <section className={styles.section}>
          <h2>Créer un compte</h2>
          <p>Rejoignez notre communauté pour accéder à toutes les formations.</p>
          <a href="/inscription" className={styles.buttonSecondary}>S'inscrire</a>
        </section>

        <section className={styles.sectionAlt}>
          <h2>Déjà inscrit ?</h2>
          <p>Connectez-vous pour suivre vos formations.</p>
          <a href="/login" className={styles.buttonSecondary}>Se connecter</a>
        </section>

        <section className={styles.section}>
          <h2>Une question ?</h2>
          <p>Contactez-nous pour en savoir plus sur nos offres.</p>
          <a href="/contact" className={styles.buttonPrimary}>Nous contacter</a>
        </section>
      </div>
    </>
  );
}
