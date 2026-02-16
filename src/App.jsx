import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  Newspaper, 
  OctagonAlert, 
  Globe,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 915);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const categories = ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];

  // Handle mobile menu responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 915);
      if (window.innerWidth > 915) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNews = useCallback(async (searchQuery = '') => {
    if (!API_KEY) {
      console.warn("API Key missing.");
      return;
    }

    setLoading(true);
    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const BASE_URL = isLocal ? 'https://gnews.io/api/v4' : '/api/news';
      
      const effectiveQuery = searchQuery || query;
      const endpoint = effectiveQuery.trim() ? '/search' : '/top-headlines';
      
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          q: effectiveQuery.trim() || undefined,
          category: effectiveQuery.trim() ? undefined : category,
          lang: 'en',
          max: 12,
          page: page,
          apikey: API_KEY
        }
      });

      setArticles(response.data.articles || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Fetch Error Details:", error.response?.data?.errors || error.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, page, API_KEY]);

  useEffect(() => {
    fetchNews();
  }, [category, page, fetchNews]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews(query);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setQuery('');
    setPage(1);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (min-width: 916px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-menu-dropdown { display: none !important; }
        }
        @media (max-width: 915px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
      
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 h-14 md:h-16 gap-4">
            <div 
              className="flex items-center gap-2 shrink-0 cursor-pointer group" 
              onClick={() => {setQuery(''); setCategory('general'); setPage(1); setMenuOpen(false);}}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 md:p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
                <Newspaper size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-base md:text-xl font-black tracking-tighter leading-none text-slate-900 uppercase">
                  Daily<span className="text-blue-600">Pulse</span>
                </h1>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">
                  By Abdalsalam
                </span>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-[140px] xs:max-w-[200px] md:max-w-md relative group">
              <input 
                type="text" 
                placeholder="Press Enter to search..." 
                className="w-full bg-slate-100 border-none rounded-xl py-1.5 md:py-2 pl-8 md:pl-10 pr-3 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-xs md:text-sm outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 md:left-3.5 top-2 md:top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            </form>

            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn hidden p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="desktop-nav hidden items-center border-t border-slate-100 px-2 overflow-x-auto no-scrollbar scroll-smooth h-12 bg-white">
            <div className="flex items-center gap-1 min-w-max">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  /* Added cursor-pointer here */
                  className={`px-6 h-10 text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap cursor-pointer
                    ${category === cat && !query ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {cat}
                  {category === cat && !query && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {menuOpen && isMobile && (
            <div className="mobile-menu-dropdown border-t border-slate-100 bg-white shadow-lg">
              <nav className="px-4 py-3">
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      /* Added cursor-pointer here */
                      className={`px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded-lg text-center cursor-pointer
                        ${category === cat && !query ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl p-4 h-[350px]">
                <div className="bg-slate-200 w-full h-40 rounded-2xl mb-4" />
                <div className="bg-slate-200 w-3/4 h-6 rounded-md mb-2" />
                <div className="bg-slate-200 w-full h-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
            {articles.map((article, index) => (
              <article key={index} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800'}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800';
                      e.target.onerror = null;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={article.title}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black uppercase text-blue-600">
                    {article.source.name}
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium mb-3 uppercase tracking-widest">
                    <Calendar size={12} className="text-blue-500" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm line-clamp-3 mb-6 leading-relaxed">
                    {article.description}
                  </p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold text-[10px] rounded-xl hover:bg-blue-600 transition-all shadow-sm cursor-pointer">
                    READ ARTICLE <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <OctagonAlert className="mx-auto text-slate-200 mb-4" size={60} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No News Available</h3>
            <p className="text-slate-500 text-sm mb-6">Check your API daily limit or environment variables.</p>
            <button onClick={() => {setQuery(''); setCategory('general'); setPage(1);}} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all cursor-pointer">Reset Filters</button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-10 bg-white text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <Globe className="text-blue-600" size={18} />
          <span className="font-black text-lg tracking-tighter uppercase italic text-slate-900">
            DailyPulse <span className="text-slate-400 font-light mr-1">by</span> Abdalsalam
          </span>
        </div>
        <p className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">© 2026 | Powered by GNews API</p>
      </footer>
    </div>
  );
}

export default App;