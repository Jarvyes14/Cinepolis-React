export default function TrailerPelicula({ movie }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Tráiler Oficial</h2>
      <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 relative group aspect-video">
        {movie.trailer ? (
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${movie.trailer}`} 
            title={`Tráiler de ${movie.title}`}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-gray-500 flex flex-col items-center">
              <span className="text-4xl mb-2">🎬</span>
              <p>Tráiler no disponible</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}