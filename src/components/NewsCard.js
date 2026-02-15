const NewsCard = ({ article }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <img 
        src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold uppercase">{article.source.name}</p>
        <h3 className="font-bold text-lg line-clamp-2 my-2">{article.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{article.description}</p>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm font-medium text-black hover:underline"
        >
          Read Full Article →
        </a>
      </div>
    </div>
  );
};