import React from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    Image,
    useColorModeValue,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
} from '@chakra-ui/react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { KKiapayCheckout } from '../components/KKiapayCheckout';
import { useAuth } from '../context/AuthContext';
import { orders } from '../services/api';

export const Cart = () => {
    const { items, updateQuantity, removeItem, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handlePaymentSuccess = async (response: any) => {
        try {
            // Créer la commande
            await orders.create({
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                transactionId: response.transactionId
            });

            // Vider le panier
            clearCart();

            // Afficher un message de succès
            toast({
                title: 'Order Successful',
                description: 'Your order has been placed successfully!',
                status: 'success',
                duration: 5000,
            });

            // Rediriger vers la page d'accueil
            navigate('/');
        } catch (error) {
            console.error('Error creating order:', error);
            toast({
                title: 'Error',
                description: 'There was an error processing your order. Please try again.',
                status: 'error',
                duration: 5000,
            });
        }
    };

    if (items.length === 0) {
        return (
            <Container maxW="7xl" py={20}>
                <VStack spacing={8} align="center">
                    <Heading size="xl">Votre panier est vide</Heading>
                    <Text color="gray.500">Ajoutez quelques produits à votre panier pour commencer !</Text>
                    <Button
                        as={Link}
                        to="/products"
                        colorScheme="brand"
                        size="lg"
                    >
                        Continue Shopping
                    </Button>
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="7xl" py={8}>
            <VStack spacing={8} align="stretch">
                <Heading size="xl" textAlign="center">Panier d'achat</Heading>
                
                <Box
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    overflow="hidden"
                    shadow="lg"
                >
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Product</Th>
                                <Th>Price</Th>
                                <Th>Quantity</Th>
                                <Th>Total</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {items.map((item) => (
                                <Tr key={item.product.id}>
                                    <Td>
                                        <HStack spacing={4}>
                                            <Image
                                                src={item.product.image || 'https://via.placeholder.com/100'}
                                                alt={item.product.name}
                                                boxSize="100px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="bold">{item.product.name}</Text>
                                                <Text color="gray.500" fontSize="sm">
                                                    {item.product.description}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </Td>
                                    <Td>
                                        {item.product.price.toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'XOF',
                                        })}
                                    </Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <IconButton
                                                aria-label="Decrease quantity"
                                                icon={<FaMinus />}
                                                size="sm"
                                                onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                                                isDisabled={item.quantity === 1}
                                            />
                                            <Text fontWeight="medium">{item.quantity}</Text>
                                            <IconButton
                                                aria-label="Increase quantity"
                                                icon={<FaPlus />}
                                                size="sm"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            />
                                        </HStack>
                                    </Td>
                                    <Td fontWeight="bold">
                                        {(item.product.price * item.quantity).toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'XOF',
                                        })}
                                    </Td>
                                    <Td>
                                        <IconButton
                                            aria-label="Remove item"
                                            icon={<FaTrash />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => removeItem(item.product.id)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                <Box
                    bg={bgColor}
                    p={6}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    shadow="lg"
                >
                    <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                            <Text fontSize="lg">Total:</Text>
                            <Text fontSize="lg" fontWeight="bold">
                                {total.toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: 'XOF',
                                })}
                            </Text>
                        </HStack>
                        <KKiapayCheckout
                            amount={total}
                            callback={handlePaymentSuccess}
                        />
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};
