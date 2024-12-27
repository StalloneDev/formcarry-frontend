import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    SimpleGrid,
    Image,
    Text,
    Stack,
    Heading,
    Button,
    useColorModeValue,
    Input,
    Select,
    HStack,
    VStack,
    Badge,
    Skeleton,
    Center,
    Spinner,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    vendorId: string;
}

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                toast({
                    title: 'Erreur',
                    description: 'Impossible de charger les produits',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [toast]);

    return (
        <Container maxW={'7xl'} px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
            <Heading mb={8} fontSize={{ base: '2xl', md: '3xl' }}>
                Nos Produits
            </Heading>
            {loading ? (
                <Center py={10}>
                    <Spinner size="xl" />
                </Center>
            ) : (
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing={{ base: 4, lg: 8 }}
                >
                    {products.map((product) => (
                        <Box
                            key={product.id}
                            bg={useColorModeValue('white', 'gray.800')}
                            maxW={'100%'}
                            borderWidth="1px"
                            rounded="lg"
                            shadow="lg"
                            position="relative"
                            transition="transform 0.2s"
                            _hover={{
                                transform: 'translateY(-5px)',
                            }}
                        >
                            <Box position="relative" height={{ base: '200px', md: '250px' }}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    roundedTop="lg"
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                />
                            </Box>

                            <Box p="6">
                                <Box d="flex" alignItems="baseline">
                                    <Badge rounded="full" px="2" colorScheme="blue">
                                        Nouveau
                                    </Badge>
                                </Box>
                                <Flex mt="1" justifyContent="space-between" alignItems="center">
                                    <Box
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        fontWeight="semibold"
                                        as="h4"
                                        lineHeight="tight"
                                        isTruncated
                                    >
                                        {product.name}
                                    </Box>
                                </Flex>
                                <Flex justifyContent="space-between" alignItems="center" mt={2}>
                                    <Box fontSize={{ base: 'lg', md: 'xl' }} color="blue.600">
                                        {product.price.toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'XOF',
                                        })}
                                    </Box>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => addToCart(product)}
                                    >
                                        Ajouter
                                    </Button>
                                </Flex>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
};
