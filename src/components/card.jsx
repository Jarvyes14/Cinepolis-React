import { Link } from "react-router-dom";

// AI generated code

export default function Card({ title, description, image, category, id }) {
    return (
        <Link 
            to={`/pelicula/${id}`} 
            state={{ movie: { id, title, description, image, category } }}
            className="bg-[#05102A] w-full sm:w-72 rounded-2xl flex flex-col p-4 sm:p-5 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="rounded-2xl mb-4 sm:mb-5 h-52 sm:h-64 w-full object-cover"
                />
            )}
            <div className="flex flex-col gap-1 text-white">
                <div className="bg-amber-300 pl-1 pr-1 pt-0.2 pb-0.5 rounded-md min-w-1/10 w-min flex justify-center text-sm font-medium text-black">{category}</div>
                <h2 className="card-title font-bold">{title}</h2>
                <p className="card-description font-light line-clamp-2">{description}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-amber-300 underline font-bold">Ver Detalles y Horarios</span>
                </div>
            </div>
        </Link>
    );
}