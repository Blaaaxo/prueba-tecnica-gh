import { Slider } from '@/components/ui/slider';

interface MarkupSliderProps {
    markup: number; // decimal, ej. 0.35
    onMarkupChange: (value: number) => void;
}

export function MarkupSlider({ markup, onMarkupChange }: MarkupSliderProps) {
    const markupPorcentaje = Math.round(markup * 100);

    const handleValueChange = (value: number | readonly number[]) => {
        const nuevoPorcentaje = Array.isArray(value) ? value[0] : value;
        onMarkupChange(nuevoPorcentaje / 100);
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-2">
                <span className="text-sm text-muted-foreground">Margen comercial (markup)</span>
                <div className="text-3xl font-bold">{markupPorcentaje}%</div>
            </div>

            <Slider
                value={[markupPorcentaje]}
                onValueChange={handleValueChange}
                min={10}
                max={50}
                step={1}
            />

            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>10%</span>
                <span>50%</span>
            </div>
        </div>
    );
}