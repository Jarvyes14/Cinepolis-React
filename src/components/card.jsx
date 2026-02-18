// AI generated code

export default function Card({ title, description, image, category }) {
    return (
        <div className="card" class="bg-[#05102A] w-min min-h-1/3 rounded-2xl flex flex-col p-5">
            {image && <img src={image} className="card-image" class="rounded-2xl mb-5" />}
            <div className="card-content" class="w-max flex flex-col gap-1 text-white">
                <div class="bg-amber-300 pl-1 pr-1 pt-0.2 pb-0.5 rounded-md min-w-1/10 w-min flex justify-center text-sm font-medium text-black">{category}</div>
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
                <a href="" class="text-xs text-blue-600 underline font-bold">Ver Sinopsis</a>
            </div>
        </div>
    );
}