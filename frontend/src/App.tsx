import './App.css';
import { useCallback, useMemo, useState } from 'react';
import { useCatalog } from './hooks/useCatalog';
import { useMarkupSimulation } from './hooks/useMarkupSimulation';
import { groupByCategory } from './lib/groupByCategory';
import { getTopOpportunities } from './lib/getTopOpportunities';
import { TopBar } from './components/TopBar';
import { NavBar } from './components/NavBar';
import { Widget } from './components/Widget';
import { KpiGrid } from './components/KpiGrid';
import { InsightsGrid } from './components/InsightsGrid';
import { Top3Grid } from './components/Top3Grid';
import { Top3Chart } from './components/Top3Chart';
import { CategoryRanking } from './components/CategoryRanking';
import { CategoryDistribution } from './components/CategoryDistribution';
import { ProductTable } from './components/ProductTable';
import { ExecutiveFooter } from './components/ExecutiveFooter';
import { MarkupSlider } from './components/MarkupSlider';

const NAV_ITEMS = [
    { id: 'overview', label: 'Resumen' },
    { id: 'opportunities', label: 'Top oportunidades' },
    { id: 'analytics', label: 'Analítica' },
    { id: 'catalog', label: 'Catálogo' },
];

function App() {
    const { catalogoBase, loading, error, fuenteDatos } = useCatalog();
    const { markup, setMarkup, catalogoRecalculado } = useMarkupSimulation(catalogoBase);
    const [activeSection, setActiveSection] = useState<string>('overview');

    const categorias = useMemo(
        () => groupByCategory(catalogoRecalculado),
        [catalogoRecalculado]
    );
    const top3 = useMemo(() => getTopOpportunities(catalogoRecalculado), [catalogoRecalculado]);

    const handleNavigate = useCallback((id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center space-y-3">
                    <div className="inline-block h-8 w-8 rounded-full border-2 border-blue border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Cargando catálogo…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background p-6">
                <div className="max-w-md rounded-xl border border-red/40 bg-red/5 p-6 text-center">
                    <p className="font-heading text-lg font-semibold text-red mb-2">
                        No se pudo conectar con el backend
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Verifica que el servidor esté corriendo en <span className="font-mono">http://localhost:3000</span>.
                    </p>
                    <p className="text-xs text-muted-foreground mt-3 font-mono break-all">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <TopBar fuenteDatos={fuenteDatos} />
            <NavBar
                items={NAV_ITEMS}
                activeId={activeSection}
                onNavigate={handleNavigate}
            />

            <section className="bg-card sticky top-0 z-30 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
                    <MarkupSlider markup={markup} onMarkupChange={setMarkup} />
                </div>
            </section>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
                <section id="overview" className="scroll-mt-24 space-y-6">
                    <KpiGrid products={catalogoRecalculado} markup={markup} />
                </section>

                <section id="opportunities" className="scroll-mt-24">
                    <Widget
                        eyebrow="Oportunidades priorizadas"
                        title="Top 3 de oportunidad"
                        description="Productos con rating ≥ 4.0 y más de 100 reseñas, ordenados por utilidad proyectada."
                    >
                        <div className="space-y-6">
                            <Top3Chart products={top3} />
                            <Top3Grid products={top3} />
                        </div>
                    </Widget>
                </section>

                <section id="analytics" className="scroll-mt-24 space-y-6">
                    <Widget
                        eyebrow="Analítica por categoría"
                        title="Resumen por categoría"
                        description="Promedios de precio de venta, utilidad y rating agrupados por línea de producto."
                    >
                        <CategoryRanking categories={categorias} />
                    </Widget>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Widget
                            eyebrow="Resumen ejecutivo"
                            title="Para llevar a la junta"
                            description="Tres conclusiones clave."
                        >
                            <InsightsGrid
                                products={catalogoRecalculado}
                                categories={categorias}
                                markup={markup}
                            />
                        </Widget>

                        <Widget
                            eyebrow="Distribución del catálogo"
                            title="Mix de categorías"
                            description="Participación por número de SKUs en el catálogo."
                        >
                            <CategoryDistribution categories={categorias} />
                        </Widget>
                    </div>
                </section>

                <section id="catalog" className="scroll-mt-24">
                    <ProductTable products={catalogoRecalculado} />
                </section>
            </main>

            <ExecutiveFooter />
        </div>
    );
}

export default App;