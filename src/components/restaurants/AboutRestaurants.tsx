import { aboutRestaurantSections } from "@/lib/restaurants-data";

export function AboutRestaurants() {
    return (
        <section className="my-12">
            {aboutRestaurantSections.map(section => (
                <div key={section.title} className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                </div>
            ))}
        </section>
    );
}