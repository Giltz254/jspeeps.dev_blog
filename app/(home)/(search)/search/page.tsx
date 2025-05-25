// app/search/page.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input'; // Optional: use your Input component
import { Button } from '@/components/ui/button'; // Optional: use your Button component
import { Loader2, Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    // Simulate API call
    setTimeout(() => {
      setResults([
        { id: 1, title: 'Example Result 1', description: 'Description of result 1' },
        { id: 2, title: 'Example Result 2', description: 'Description of result 2' },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <div className="flex items-center gap-2 mb-6">
        <Input
          className="flex-1"
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {loading && (
        <p className="text-gray-500">Searching...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="p-4 border rounded-lg shadow-sm hover:shadow transition">
            <h2 className="text-lg font-semibold">{result.title}</h2>
            <p className="text-gray-600">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
