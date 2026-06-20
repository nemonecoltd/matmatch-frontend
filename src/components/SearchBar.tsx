"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // URL 파라미터가 변경되면 입력 필드 동기화 (로고 클릭 등 대응)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/');
    }
  };

  const clearSearch = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSearch} className="relative group w-full max-w-[200px] md:max-w-[300px] mx-4">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/40 group-focus-within:text-[#D4AF37] transition-colors">
        <Search size={14} />
      </div>
      <input 
        type="text"
        placeholder="SEARCH..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-10 text-[#D4AF37] placeholder:text-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37]/40 focus:bg-white/10 transition-all font-black italic tracking-[0.2em] text-[10px]"
      />
      {query && (
        <button 
          type="button"
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
