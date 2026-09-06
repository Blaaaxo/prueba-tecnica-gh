/**
 * Formatea un número como pesos colombianos.
 * Locale fijo en 'es-CO' para que el formato sea consistente
 * sin importar la configuración regional del navegador del usuario.
 */
export function formatCOP(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(valor);
}