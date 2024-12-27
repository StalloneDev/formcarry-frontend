import React, { useState } from 'react';
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
    Stack,
    Flex,
    MinusIcon,
    AddIcon,
    DeleteIcon,
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { KKiapayCheckout } from '../components/KKiapayCheckout';
import { useAuth } from '../context/AuthContext';
import { orders } from '../services/api';

export const Cart = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(productId, newQuantity);
        }
    };

    return (
        <Box w="full" px={{ base: 2, md: 8 }} py={{ base: 4, md: 12 }}>
            <Heading 
                mb={{ base: 4, md: 8 }} 
                fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                px={{ base: 2, md: 0 }}
            >
                Mon Panier
            </Heading>

            {cart.length === 0 ? (
                <VStack spacing={6} align="center" py={{ base: 8, md: 12 }}>
                    <Text fontSize={{ base: 'md', md: 'lg' }} textAlign="center">
                        Votre panier est vide
                    </Text>
                    <Button
                        as={Link}
                        to="/products"
                        colorScheme="blue"
                        size={{ base: 'md', md: 'lg' }}
                        w={{ base: 'full', sm: 'auto' }}
                    >
                        Voir nos produits
                    </Button>
                </VStack>
            ) : (
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    spacing={{ base: 4, md: 6, lg: 8 }}
                    align="flex-start"
                >
                    {/* Liste des produits */}
                    <VStack flex="1" spacing={{ base: 3, md: 4 }} align="stretch" w="full">
                        {cart.map((item) => (
                            <Box
                                key={item.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                bg={useColorModeValue('white', 'gray.800')}
                            >
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    spacing={0}
                                >
                                    {/* Image du produit */}
                                    <Box
                                        w={{ base: '100%', sm: '120px' }}
                                        h={{ base: '120px', sm: '120px' }}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                    </Box>

                                    {/* Détails du produit */}
                                    <Stack
                                        flex="1"
                                        p={{ base: 3, sm: 4 }}
                                        spacing={3}
                                    >
                                        <Stack spacing={1}>
                                            <Text
                                                fontSize={{ base: 'sm', md: 'md' }}
                                                fontWeight="semibold"
                                                noOfLines={2}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                fontSize={{ base: 'sm', md: 'md' }}
                                                color="blue.600"
                                                fontWeight="semibold"
                                            >
                                                {item.price.toLocaleString('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'XOF',
                                                })}
                                            </Text>
                                        </Stack>

                                        {/* Contrôles de quantité */}
                                        <Flex 
                                            justify="space-between" 
                                            align="center"
                                            wrap="wrap"
                                            gap={2}
                                        >
                                            <HStack spacing={2}>
                                                <IconButton
                                                    aria-label="Diminuer la quantité"
                                                    icon={<MinusIcon />}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    isDisabled={item.quantity <= 1}
                                                />
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                    minW="2rem"
                                                    textAlign="center"
                                                >
                                                    {item.quantity}
                                                </Text>
                                                <IconButton
                                                    aria-label="Augmenter la quantité"
                                                    icon={<AddIcon />}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                />
                                            </HStack>
                                            <IconButton
                                                aria-label="Supprimer l'article"
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => removeFromCart(item.id)}
                                            />
                                        </Flex>
                                    </Stack>
                                </Stack>
                            </Box>
                        ))}
                    </VStack>

                    {/* Résumé de la commande */}
                    <Box
                        w={{ base: 'full', lg: '320px' }}
                        position={{ base: 'relative', lg: 'sticky' }}
                        top={{ lg: '24px' }}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={{ base: 4, md: 6 }}
                        bg={useColorModeValue('white', 'gray.800')}
                    >
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="lg" fontWeight="semibold">
                                Résumé de la commande
                            </Text>
                            <Flex justify="space-between" align="center">
                                <Text fontSize="md">Total</Text>
                                <Text 
                                    fontSize="lg" 
                                    fontWeight="bold"
                                    color="blue.600"
                                >
                                    {total.toLocaleString('fr-FR', {
                                        style: 'currency',
                                        currency: 'XOF',
                                    })}
                                </Text>
                            </Flex>
                            <Button
                                colorScheme="blue"
                                size="lg"
                                w="full"
                                onClick={() => setIsPaymentOpen(true)}
                            >
                                Payer maintenant
                            </Button>
                        </VStack>
                    </Box>
                </Stack>
            )}

            <KKiapayCheckout
                amount={total}
                key={total}
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
            />
        </Box>
    );
};
