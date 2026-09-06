import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { CategoryAnalytics } from '../types/product';
import { formatCOP } from '../lib/format';

interface CategoryCardProps {
    category: CategoryAnalytics;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="capitalize text-base">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Productos</span>
                    <span className="font-medium">{category.cantidadProductos}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio promedio venta</span>
                    <span className="font-medium">{formatCOP(category.precioPromedioVentaCOP)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilidad promedio</span>
                    <span className="font-medium">{formatCOP(category.utilidadPromedioCOP)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating promedio</span>
                    <span className="font-medium">{category.ratingPromedio.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}