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
        <div className="w-full">
            <div className="flex items-center justify-between gap-6 mb-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue">
                        Control global
                    </p>
                    <span className="block text-xs text-muted-foreground mt-1">
                        Margen comercial (markup) sobre costo COP · cambia todos los gráficos en tiempo real
                    </span>
                </div>
                <div className="flex-none text-right">
                    <div className="font-heading text-3xl md:text-4xl font-bold leading-none text-foreground tabular-nums">
                        {markupPorcentaje}<span className="text-blue text-xl md:text-2xl">%</span>
                    </div>
                </div>
            </div>

            <div className="[&_[data-slot=slider-track]]:bg-muted [&_[data-slot=slider-range]]:bg-blue">
                <Slider
                    value={[markupPorcentaje]}
                    onValueChange={handleValueChange}
                    min={10}
                    max={50}
                    step={1}
                />
            </div>

            <div className="flex justify-between mt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
                <span>10% — Conservador</span>
                <span>50% — Agresivo</span>
            </div>
        </div>
    );
}