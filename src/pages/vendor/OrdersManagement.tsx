import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useToast,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { vendor } from '../../services/api';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        description: string;
    };
}

interface Order {
    id: string;
    createdAt: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    user: {
        name: string;
        email: string;
    };
}

export const OrdersManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const toast = useToast();

    const fetchOrders = async () => {
        try {
            const response = await vendor.getOrders();
            setOrders(response.data);
        } catch (error: any) {
            toast({
                title: 'Error fetching orders',
                description: error.response?.data?.error || 'An error occurred',
                status: 'error',
                duration: 3000,
            });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'yellow';
            case 'PAID':
                return 'green';
            case 'DELIVERED':
                return 'blue';
            case 'CANCELLED':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Box>
            <Accordion allowMultiple>
                {orders.map((order) => (
                    <AccordionItem key={order.id}>
                        <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    Order #{order.id.slice(0, 8)} - {order.user.name}
                                    <Badge
                                        ml={2}
                                        colorScheme={getStatusColor(order.status)}
                                    >
                                        {order.status}
                                    </Badge>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Box mb={4}>
                                <strong>Customer:</strong> {order.user.name} ({order.user.email})
                                <br />
                                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                                <br />
                                <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                            </Box>

                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Product</Th>
                                        <Th>Quantity</Th>
                                        <Th>Price</Th>
                                        <Th>Total</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {order.items.map((item) => (
                                        <Tr key={item.id}>
                                            <Td>{item.product.name}</Td>
                                            <Td>{item.quantity}</Td>
                                            <Td>${item.price.toFixed(2)}</Td>
                                            <Td>${(item.price * item.quantity).toFixed(2)}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
};
