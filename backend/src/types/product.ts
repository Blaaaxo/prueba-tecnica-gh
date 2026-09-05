

export interface Rating {
    rate: number;
    count: number;
}

// espejo exacto de lo que devuelve la api de fakestoreapi.com/products
export interface RawProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: Rating;
}

// lo que calculamos en el backend y exponemos a traves de la api
export interface ProcessedProduct {
    id: number;
    title: string;
    category: string;
    image: string;
    rating: Rating;
    priceUSD: number;               // precio original, viene desde la api de fakestoreapi.com/products    
    costoCOP: number;               // priceUSD * TRM que para la prueba tecnica es 4000
    markupAplicado: number;         // el markup que se uso en calculo para la prueba es de 0.35 (35%)
    precioVentaCOP: number;         // costoCOP * (1 + markupAplicado)
    utilidadCOP: number;

}