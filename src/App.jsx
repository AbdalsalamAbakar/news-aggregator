import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  Newspaper, 
  OctagonAlert, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Globe
} from 'lucide-react';

function App() {
  // --- STATE MANAGEMENT ---
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  // --- API FETCH LOGIC ---
  const fetchNews = async () => {
    setLoading(true);
    try {
      // Logic: 'everything' endpoint for search, 'top-headlines' for categories
      const url = query 
        ? `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=12&language=en&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?category=${category}&country=us&page=${page}&pageSize=12&apiKey=${API_KEY}`;
      
      const response = await axios.get(url);
      setArticles(response.data.articles || []);
      
      // Smooth scroll to top when changing pages or categories
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Fetch Error:", error);
    }
    setLoading(false);
  };

  // Trigger fetch when category or page changes
  useEffect(() => {
    fetchNews();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    fetchNews();
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const categories = ['general', 'technology', 'business', 'entertainment', 'health', 'science', 'sports'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVIGATION BAR --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 shrink-0 cursor-pointer group" 
            onClick={() => window.location.reload()}
          >
            <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:bg-blue-700 transition-colors">
              <Newspaper size={24} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight hidden sm:block">
              Daily<span className="text-blue-600">Pulse</span>
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search news..." 
              className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {['technology', 'business', 'sports'].map((cat) => (
              <button 
                key={cat}
                onClick={() => {setCategory(cat); setQuery(''); setPage(1);}}
                className={`text-sm font-bold capitalize transition-colors ${category === cat && !query ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- MOBILE DRAWER --- */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 absolute w-full shadow-xl animate-in fade-in slide-in-from-top-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => {
                    setCategory(cat); 
                    setQuery(''); 
                    setPage(1); 
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize border transition-all ${category === cat && !query ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* --- CATEGORY PILLS (Desktop Only) --- */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => {setCategory(cat); setQuery(''); setPage(1);}}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${category === cat && !query ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 shadow-sm'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* --- NEWS FEED --- */}
      <main className="max-w-7xl mx-auto px-4 pt-4 lg:pt-0 pb-20">
        
        {loading ? (
          /* Skeleton Loading Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl p-4 h-[400px]">
                <div className="bg-slate-200 w-full h-48 rounded-2xl mb-4" />
                <div className="bg-slate-200 w-3/4 h-6 rounded-md mb-2" />
                <div className="bg-slate-200 w-full h-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          /* Actual News Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article 
                key={index} 
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img 
                    src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={article.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1585829365234-781fcd04c838?w=800&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter text-blue-600 shadow-sm">
                    {article.source.name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-4 uppercase tracking-widest">
                    <Calendar size={14} className="text-blue-500" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed">
                    {article.description || "No description provided. Click below to explore the full story from the original source."}
                  </p>
                  
                  {/* Action Button */}
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all"
                  >
                    READ ARTICLE <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
            <OctagonAlert className="mx-auto text-slate-200 mb-6" size={80} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No news matches that</h3>
            <p className="text-slate-400 max-w-xs mx-auto mb-8 font-medium">We couldn't find any articles for your current search or category.</p>
            <button 
              onClick={() => {setQuery(''); setCategory('general'); setPage(1);}}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {articles.length > 0 && (
          <div className="mt-20 flex items-center justify-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-900 shadow-sm">
              Page {page}
            </div>

            <button 
              onClick={() => setPage(page + 1)}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
     {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Globe className="text-blue-600" size={22} />
            <span className="font-black text-xl tracking-tighter uppercase italic">
              DailyPulse <span className="text-slate-400 font-light mr-1">by</span> Abdalsalam Abakar
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            © 2026 | Powered by NewsAPI
          </p>
          <div className="mt-6 flex justify-center gap-4 text-slate-300">
            {/* This adds a nice decorative element to finish the page */}
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;