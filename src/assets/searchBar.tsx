import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  onSearch: (city: string) => void;
  loading: boolean;
  onGeolocation: () => void;
}

const SearchBar = ({ city, setCity, onSearch, loading, onGeolocation }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search any city..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 text-lg"
            />
          </div>

          <button
            type="button"
            onClick={onGeolocation}
            className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95"
            disabled={loading}
          >
            <MapPin size={24} className="text-white" />
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-slate-900 px-8 rounded-2xl font-semibold hover:bg-slate-100 active:scale-95 transition-all flex items-center"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;