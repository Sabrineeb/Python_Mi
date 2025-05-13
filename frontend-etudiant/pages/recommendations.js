import { useState, useEffect } from "react";

export default function Recommendations() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ category: "", price_min: "", price_max: "" });

  const fetchBooks = async () => {
    let url = "http://localhost:8000/recommendations";
    const query = [];

    if (filters.category) query.push(`category=${filters.category}`);
    if (filters.price_min) query.push(`price_min=${filters.price_min}`);
    if (filters.price_max) query.push(`price_max=${filters.price_max}`);

    if (query.length > 0) {
      url += "?" + query.join("&");
    }

    const res = await fetch(url);
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Recommandations de livres</h1>

      <div className="my-4 space-y-2">
        <input
          placeholder="Catégorie"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-1"
        />
        <input
          type="number"
          placeholder="Prix min"
          value={filters.price_min}
          onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
          className="border p-1"
        />
        <input
          type="number"
          placeholder="Prix max"
          value={filters.price_max}
          onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
          className="border p-1"
        />
        <button onClick={fetchBooks} className="bg-blue-500 text-white px-2 py-1">Filtrer</button>
      </div>

      <ul className="space-y-2">
        {books.map((book, idx) => (
          <li key={idx} className="border p-2">
            <strong>{book.title}</strong><br />
            Catégorie: {book.category}<br />
            Prix: {book.price}€<br />
            Disponibilité: {book.availability}
          </li>
        ))}
      </ul>
    </div>
  );
}
