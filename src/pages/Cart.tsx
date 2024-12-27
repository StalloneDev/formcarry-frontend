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
                    <VStack flex="1" spacing={{ base: 3, md: 4 }} align="stretch">
                        {cart.map((item) => (
                            <Box
                                key={item.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={{ base: 3, md: 4 }}
                                bg={useColorModeValue('white', 'gray.800')}
                            >
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    spacing={{ base: 3, sm: 4 }}
                                    align="stretch"
                                >
                                    <Box
                                        width={{ base: '100%', sm: '100px' }}
                                        height={{ base: '160px', sm: '100px' }}
                                        flexShrink={0}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            objectFit="cover"
                                            width="100%"
                                            height="100%"
                                            borderRadius="md"
                                        />
                                    </Box>

                                    <Stack
                                        flex="1"
                                        spacing={{ base: 2, sm: 3 }}
                                        justify="space-between"
                                    >
                                        <Box>
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
                                                mt={1}
                                            >
                                                {item.price.toLocaleString('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'XOF',
                                                })}
                                            </Text>
                                        </Box>

                                        <HStack 
                                            spacing={2} 
                                            justify={{ base: 'space-between', sm: 'flex-start' }}
                                            align="center"
                                        >
                                            <HStack spacing={1}>
                                                <IconButton
                                                    aria-label="Diminuer la quantité"
                                                    icon={<MinusIcon />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    isDisabled={item.quantity <= 1}
                                                />
                                                <Text
                                                    fontSize={{ base: 'sm', md: 'md' }}
                                                    fontWeight="medium"
                                                    minW="32px"
                                                    textAlign="center"
                                                >
                                                    {item.quantity}
                                                </Text>
                                                <IconButton
                                                    aria-label="Augmenter la quantité"
                                                    icon={<AddIcon />}
                                                    size="sm"
                                                    variant="ghost"
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
                                        </HStack>
                                    </Stack>
                                </Stack>
                            </Box>
                        ))}
                    </VStack>

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
                            <Heading size="md">Résumé de la commande</Heading>
                            <HStack justify="space-between">
                                <Text fontSize={{ base: 'sm', md: 'md' }}>Total</Text>
                                <Text 
                                    fontSize={{ base: 'md', md: 'lg' }} 
                                    fontWeight="bold"
                                    color="blue.600"
                                >
                                    {total.toLocaleString('fr-FR', {
                                        style: 'currency',
                                        currency: 'XOF',
                                    })}
                                </Text>
                            </HStack>
                            <Button
                                colorScheme="blue"
                                size={{ base: 'md', md: 'lg' }}
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
