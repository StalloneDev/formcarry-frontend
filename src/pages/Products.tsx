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
    IconButton,
    FaShoppingCart,
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

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast({
            title: 'Produit ajouté',
            description: `${product.name} a été ajouté au panier`,
            status: 'success',
            duration: 2000,
        });
    };

    return (
        <Box w="full" px={{ base: 4, md: 8 }} py={{ base: 6, md: 12 }}>
            <Heading 
                mb={{ base: 6, md: 8 }} 
                fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                px={{ base: 2, md: 0 }}
            >
                Nos Produits
            </Heading>
            
            {loading ? (
                <Center py={10}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                </Center>
            ) : (
                <SimpleGrid
                    columns={{ base: 2, md: 3, lg: 4 }}
                    spacing={{ base: 3, md: 4, lg: 6 }}
                >
                    {products.map((product) => (
                        <Box
                            key={product.id}
                            bg={useColorModeValue('white', 'gray.800')}
                            borderWidth="1px"
                            rounded="lg"
                            shadow="sm"
                            _hover={{
                                shadow: 'md',
                                transform: 'translateY(-2px)',
                            }}
                            transition="all 0.2s"
                        >
                            <Box position="relative" height={{ base: '120px', sm: '140px', md: '160px' }}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    roundedTop="lg"
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                    fallback={<Skeleton h="100%" />}
                                />
                                <Badge
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    px={2}
                                    py={1}
                                    colorScheme="blue"
                                    rounded="md"
                                    fontSize="xs"
                                >
                                    Nouveau
                                </Badge>
                            </Box>

                            <VStack p={{ base: 2, md: 4 }} spacing={2} align="stretch">
                                <Text
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="semibold"
                                    noOfLines={2}
                                >
                                    {product.name}
                                </Text>
                                
                                <HStack justify="space-between" align="center">
                                    <Text
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        fontWeight="bold"
                                        color="blue.600"
                                    >
                                        {product.price.toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'XOF',
                                        })}
                                    </Text>
                                    <IconButton
                                        aria-label="Ajouter au panier"
                                        icon={<FaShoppingCart />}
                                        size={{ base: 'sm', md: 'md' }}
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={() => handleAddToCart(product)}
                                    />
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};
