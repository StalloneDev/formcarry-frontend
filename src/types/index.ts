export interface User {
    id: string;
    email: string;
    name: string;
    role: 'client' | 'vendor';
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    vendorId: string;
}

export interface Order {
    id: string;
    userId: string;
    products: {
        productId: string;
        quantity: number;
    }[];
    status: 'pending' | 'paid' | 'delivered';
    totalAmount: number;
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
