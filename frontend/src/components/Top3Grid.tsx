import type { ProcessedProduct } from '../types/product';
import { getTopOpportunities } from '../lib/getTopOpportunities';
import { Top3Card } from './Top3Card';

interface Top3GridProps {
    products: ProcessedProduct[];
}

export function Top3Grid({ products }: Top3GridProps) {
    const top3 = getTopOpportunities(products);

    if (top3.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                Ningún producto cumple los criterios de oportunidad todavía.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {top3.map((product, index) => (
                <Top3Card key={product.id} product={product} rank={index + 1} />
            ))}
        </div>
    );
}