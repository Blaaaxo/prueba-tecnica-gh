import type { ProcessedProduct } from '../types/product';
import { groupByCategory } from '../lib/groupByCategory';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
    products: ProcessedProduct[];
}

export function CategoryGrid({ products }: CategoryGridProps) {
    const categorias = groupByCategory(products);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorias.map((categoria) => (
                <CategoryCard key={categoria.category} category={categoria} />
            ))}
        </div>
    );
}