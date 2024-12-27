export interface User {
    id: string;
    email: string;
    name: string;
    role: 'CLIENT' | 'VENDOR';
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
