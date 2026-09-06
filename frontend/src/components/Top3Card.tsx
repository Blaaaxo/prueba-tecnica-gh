import { Card, CardContent } from '@/components/ui/card';
import type { ProcessedProduct } from '../types/product';
import { formatCOP } from '../lib/format';

interface Top3CardProps {
    product: ProcessedProduct;
    rank: number;
}

export function Top3Card({ product, rank }: Top3CardProps) {
    return (
        <Card className="relative border-2 border-yellow-500">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-yellow-500 text-white font-bold flex items-center justify-center text-sm">
                {rank}
            </div>
            <CardContent className="pt-6 space-y-2">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-24 w-full object-contain mb-2"
                />
                <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{product.title}</h3>

                <div className="text-sm space-y-1 pt-2 border-t">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Costo</span>
                        <span>{formatCOP(product.costoCOP)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Venta sugerida</span>
                        <span>{formatCOP(product.precioVentaCOP)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span className="text-muted-foreground">Utilidad</span>
                        <span>{formatCOP(product.utilidadCOP)}</span>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground pt-1">
                    ★ {product.rating.rate} · {product.rating.count} reseñas
                </p>
            </CardContent>
        </Card>
    );
}