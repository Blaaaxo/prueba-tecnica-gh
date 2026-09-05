# Simulador de rentabilidad e-commerce — El Gigante del Hogar

MVP full-stack que captura el catálogo de [fakestoreapi.com](https://fakestoreapi.com/products), lo convierte a pesos colombianos (COP), aplica un margen comercial (markup) configurable, y presenta un dashboard gerencial para evaluar qué productos importar.

## Tecnologías

- Node.js
- Express
- TypeScript
- React
- Vite

## Requisitos

- Node.js 18 o superior
- pnpm (o npm/yarn si prefieres, ajustando los comandos)

## Instrucciones de despliegue

### Backend

```bash
cd backend
pnpm install
pnpm run dev
```
El servidor queda escuchando en `http://localhost:3000`

### Frontend

_Pendiente_

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/analytics?markup=0.35` | Métricas agregadas por categoría: cantidad de productos, precio promedio de venta, utilidad promedio y rating promedio. |
| GET | `/api/products/opportunities?markup=0.35` | Catálogo completo procesado (con precios en COP) + Top 3 de Oportunidad. |

El parámetro `markup` es opcional. Rango permitido: `0.10` a `0.50` (10%–50%). Si no se envía, o el valor es inválido, se usa `0.35` (35%) por defecto.

## Reglas de negocio implementadas

- **Conversión:** `costoCOP = precioUSD * 4000` (TRM fija según el reto).
- **Markup:** `precioVentaCOP = costoCOP * (1 + markup)`, aplicado sobre el costo en COP.
- **Top 3 de Oportunidad:** productos con `rating.rate >= 4.0` y `rating.count > 100`, ordenados por utilidad proyectada (COP) de mayor a menor.