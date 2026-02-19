// AI generated code

export default function Card({ title, description, image, category }) {
    return (
        <div className="bg-[#05102A] w-full sm:w-72 rounded-2xl flex flex-col p-4 sm:p-5">
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="rounded-2xl mb-4 sm:mb-5 h-52 sm:h-64 w-full object-cover"
                />
            )}
            <div className="flex flex-col gap-1 text-white">
                <div className="bg-amber-300 pl-1 pr-1 pt-0.2 pb-0.5 rounded-md min-w-1/10 w-min flex justify-center text-sm font-medium text-black">{category}</div>
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
                <a href="" className="text-xs text-blue-600 underline font-bold">Ver Sinopsis</a>
            </div>
        </div>
    );
}