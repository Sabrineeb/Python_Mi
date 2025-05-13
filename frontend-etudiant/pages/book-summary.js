import { useState } from "react";

export default function BookSummary() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:8000/books/summary?text=${encodeURIComponent(text)}`);
    const data = await res.json();
    setSummary(data.summary || "Erreur lors de la génération du résumé");
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Résumé intelligent de livre</h1>
      <textarea
        className="w-full h-40 border p-2 mt-4"
        placeholder="Collez le texte du livre ici (au moins 100 caractères)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-2 bg-green-600 text-white px-3 py-1"
        onClick={generateSummary}
        disabled={loading || text.length < 100}
      >
        {loading ? "Résumé en cours..." : "Générer le résumé"}
      </button>

      {summary && (
        <div className="mt-4 border p-4 bg-gray-50">
          <h2 className="font-bold">Résumé généré :</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
