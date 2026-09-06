# Simulador de rentabilidad e-commerce — El Gigante del Hogar

MVP full-stack que captura el catálogo de [fakestoreapi.com](https://fakestoreapi.com/products), lo convierte a pesos colombianos (COP), aplica un margen comercial (markup) configurable, y presenta un dashboard gerencial para evaluar qué productos importar.

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

El servidor queda escuchando en `http://localhost:3000`.

### Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm run dev
```

El frontend queda disponible en `http://localhost:5173` (puerto por defecto de Vite).

**Importante:** el backend y el frontend son dos proyectos independientes. Para que el dashboard funcione, ambos deben estar corriendo al mismo tiempo, en dos terminales distintas:

```bash
# Terminal 1
cd backend && pnpm run dev

# Terminal 2
cd frontend && pnpm run dev
```

## Tecnologías

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, Vite, TypeScript, Tailwind CSS v4, shadcn/ui (con Base UI como base de componentes)

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

## Visión estratégica y resiliencia

### Gestión de Recursos: ¿qué estrategia de caché implementarías para no saturar la API externa, reducir la latencia y optimizar los costos de servidor?

En un entorno de producción real, la estrategia ideal sería usar **Redis** como capa de caché centralizada, en vez de depender de la memoria del propio proceso de Node.js. Esto da más control sobre el tiempo de vida de los datos, permite invalidar la caché manualmente si es necesario, y desacopla el estado de caché del ciclo de vida del servidor (si el proceso se reinicia, los datos cacheados en Redis persisten).

Para el alcance de este MVP, implementé una versión simplificada de esa misma idea, en dos capas dentro de `backend/src/services/fakeStore.service.ts`:

1. **Caché en memoria con `node-cache`, TTL de 10 minutos.** La primera petición a cualquiera de los dos endpoints consulta `fakestoreapi.com`; las siguientes, mientras la caché esté vigente, se sirven desde memoria sin volver a golpear la API externa. Diez minutos es suficiente para un catálogo que no cambia con frecuencia, y evita que cada interacción del usuario en el frontend (recargar la página, por ejemplo) dispare una llamada nueva.

2. **Snapshot persistido en disco** (`backend/src/data/fallback-snapshot.json`): cada vez que una llamada en vivo tiene éxito, el backend sobrescribe este archivo. Esto no es solo una optimización de rendimiento, sino también la base de la estrategia de continuidad del negocio.

Migrar de `node-cache` a Redis en el futuro sería un cambio de bajo esfuerzo: la lógica de "revisar caché → si no existe, buscar en vivo → guardar en caché" se mantendría igual, solo cambiaría la implementación del cliente de caché.

### Continuidad del negocio: si la API de fakestoreapi.com se cae en medio de una presentación a la junta directiva, ¿qué estrategia técnica de contingencia usarías para que el Dashboard no quede en blanco?

En producción implementaría un mecanismo de **fallback** respaldado por una caché persistente, como Redis, y un **Circuit Breaker** para evitar llamadas repetidas mientras la API externa esté fallando. El Dashboard indicaría que está mostrando datos de respaldo y la fecha de su última actualización. También utilizaría una base de datos persistente para conservar el último catálogo válido ante reinicios o pérdida de la caché.

En este MVP implementé una solución más simple: una caché en memoria con `node-cache` y un TTL de 10 minutos, complementada por un snapshot persistido en `backend/src/data/fallback-snapshot.json`. Cuando la API responde correctamente, el catálogo se guarda en ambas capas. Si la API falla y la caché en memoria no está disponible, el backend lee el último snapshot válido desde disco y continúa entregando datos al Dashboard. El Circuit Breaker y Redis quedan como mejoras para una versión de producción.