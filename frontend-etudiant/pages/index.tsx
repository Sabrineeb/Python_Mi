export default function Home() {
  return (
    <>
      <main className="bg-white text-gray-800">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue sur notre plateforme</h1>
            <p className="text-lg md:text-xl mb-6">Explorez nos formations et développez vos compétences.</p>
            <a href="/services" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Découvrir nos services
            </a>
          </div>
        </section>

        

        {/* Section Inscription */}
        <section className="bg-indigo-50 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Créer un compte</h2>
            <p className="mb-6">Rejoignez notre communauté pour accéder à toutes les formations.</p>
            <a href="/inscription" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
              S'inscrire
            </a>
          </div>
        </section>

        {/* Section Connexion */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Déjà inscrit ?</h2>
            <p className="mb-6">Connectez-vous pour suivre vos formations.</p>
            <a href="/connexion" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              Se connecter
            </a>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Une question ?</h2>
            <p className="mb-6">Contactez-nous pour en savoir plus sur nos offres.</p>
            <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              Nous contacter
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
