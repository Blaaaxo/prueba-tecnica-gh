import './App.css';
import { useCatalog } from './hooks/useCatalog';
import { useMarkupSimulation } from './hooks/useMarkupSimulation';
import { MarkupSlider } from './components/MarkupSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { Top3Grid } from './components/Top3Grid';

function App() {
    const { catalogoBase, loading, error, fuenteDatos } = useCatalog();
    const { markup, setMarkup, catalogoRecalculado } = useMarkupSimulation(catalogoBase);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Cargando catálogo…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-destructive">
                    No se pudo conectar con el backend. Verifica que esté corriendo. Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <header className="mb-8">
                <p className="text-sm text-muted-foreground">El Gigante del Hogar</p>
                <h1 className="text-3xl font-bold">Simulador de Rentabilidad e-Commerce</h1>
                {fuenteDatos === 'disk-fallback' && (
                    <p className="text-sm text-destructive mt-1">
                        ● Modo contingencia: mostrando datos de respaldo
                    </p>
                )}
            </header>

            <section className="mb-10">
                <MarkupSlider markup={markup} onMarkupChange={setMarkup} />
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Resumen por categoría</h2>
                <CategoryGrid products={catalogoRecalculado} />
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Top 3 de Oportunidad</h2>
                <Top3Grid products={catalogoRecalculado} />
            </section>

        </div>
    );
}

export default App;