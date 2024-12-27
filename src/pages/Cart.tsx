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
        <Container maxW={'7xl'} px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
            <Heading mb={8} fontSize={{ base: '2xl', md: '3xl' }}>
                Mon Panier
            </Heading>

            {cart.length === 0 ? (
                <VStack spacing={4} align="center" py={10}>
                    <Text fontSize={{ base: 'lg', md: 'xl' }}>Votre panier est vide</Text>
                    <Button
                        as={Link}
                        to="/products"
                        colorScheme="blue"
                        size={{ base: 'md', md: 'lg' }}
                    >
                        Continuer vos achats
                    </Button>
                </VStack>
            ) : (
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    spacing={{ base: 8, lg: 12 }}
                    align={{ lg: 'flex-start' }}
                >
                    <VStack flex="2" spacing={6} align="stretch">
                        {cart.map((item) => (
                            <Box
                                key={item.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={{ base: 4, md: 6 }}
                                bg={useColorModeValue('white', 'gray.800')}
                            >
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    spacing={{ base: 4, sm: 6 }}
                                    align={{ sm: 'center' }}
                                >
                                    <Box
                                        width={{ base: '100%', sm: '120px' }}
                                        height={{ base: '200px', sm: '120px' }}
                                        position="relative"
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
                                        spacing={4}
                                        direction={{ base: 'column', sm: 'row' }}
                                        justify="space-between"
                                        align={{ base: 'stretch', sm: 'center' }}
                                    >
                                        <Box flex="1">
                                            <Text
                                                fontSize={{ base: 'md', md: 'lg' }}
                                                fontWeight="semibold"
                                            >
                                                {item.name}
                                            </Text>
                                            <Text
                                                fontSize={{ base: 'md', md: 'lg' }}
                                                color="blue.600"
                                                fontWeight="semibold"
                                            >
                                                {item.price.toLocaleString('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'XOF',
                                                })}
                                            </Text>
                                        </Box>

                                        <Stack
                                            direction={{ base: 'row', sm: 'column' }}
                                            spacing={4}
                                            align={{ base: 'center', sm: 'flex-end' }}
                                        >
                                            <HStack>
                                                <IconButton
                                                    aria-label="Decrease quantity"
                                                    icon={<MinusIcon />}
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    isDisabled={item.quantity <= 1}
                                                />
                                                <Text
                                                    fontSize={{ base: 'md', md: 'lg' }}
                                                    fontWeight="semibold"
                                                    minW="40px"
                                                    textAlign="center"
                                                >
                                                    {item.quantity}
                                                </Text>
                                                <IconButton
                                                    aria-label="Increase quantity"
                                                    icon={<AddIcon />}
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                />
                                            </HStack>
                                            <IconButton
                                                aria-label="Remove item"
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => removeFromCart(item.id)}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        ))}
                    </VStack>

                    <Box
                        flex="1"
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        position="sticky"
                        top="24px"
                        bg={useColorModeValue('white', 'gray.800')}
                    >
                        <VStack spacing={4} align="stretch">
                            <Heading size="md">Résumé de la commande</Heading>
                            <Flex justify="space-between">
                                <Text fontSize={{ base: 'md', md: 'lg' }}>Total</Text>
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
                            </Flex>
                            <Button
                                colorScheme="blue"
                                size="lg"
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
        </Container>
    );
};
