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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            return a.name.localeCompare(b.name);
        });

    const handleAddToCart = (product: Product) => {
        console.log('Adding to cart:', product);
        addItem(product);
    };

    const ProductCard = ({ product }: { product: Product }) => {
        return (
            <Box
                maxW={'sm'}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg={useColorModeValue('white', 'gray.800')}
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
                shadow="lg"
            >
                <Box position="relative" h="200px">
                    <Image
                        src={product.image || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                    />
                </Box>

                <Box p="6">
                    <Box d="flex" alignItems="baseline">
                        <Badge borderRadius="full" px="2" colorScheme="brand">
                            New
                        </Badge>
                    </Box>

                    <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
                        {product.name}
                    </Box>

                    <Box>
                        {product.price.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                        })}
                    </Box>

                    <Text mt={2} color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm" noOfLines={2}>
                        {product.description}
                    </Text>

                    <Button
                        mt={4}
                        w="full"
                        colorScheme="brand"
                        onClick={() => handleAddToCart(product)}
                    >
                        + Au Panier
                    </Button>
                </Box>
            </Box>
        );
    };

    return (
        <Box py={8}>
            <Container maxW="7xl">
                <VStack spacing={8}>
                    <Heading
                        fontSize={{ base: '2xl', sm: '4xl' }}
                        fontWeight="bold"
                        textAlign="center"
                        color={useColorModeValue('gray.800', 'white')}
                    >
                        Nos Produits
                    </Heading>

                    <HStack w="full" spacing={4} wrap="wrap">
                        <Input
                            placeholder="Faire une recherche..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            maxW="400px"
                        />
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            maxW="200px"
                        >
                            <option value="name">Trier par nom</option>
                            <option value="price-asc">Prix: Bas au Grand</option>
                            <option value="price-desc">Prix: Grand au Bas</option>
                        </Select>
                    </HStack>

                    <SimpleGrid
                        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                        spacing={6}
                        w="full"
                    >
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <Box key={i} borderWidth="1px" borderRadius="lg" overflow="hidden">
                                    <Skeleton height="200px" />
                                    <Stack p="6" spacing={3}>
                                        <Skeleton height="20px" width="150px" />
                                        <Skeleton height="20px" width="100px" />
                                        <Skeleton height="20px" />
                                        <Skeleton height="40px" />
                                    </Stack>
                                </Box>
                            ))
                            : filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                    </SimpleGrid>

                    {!loading && filteredProducts.length === 0 && (
                        <Text fontSize="lg" color="gray.500" textAlign="center">
                            No products found matching your search.
                        </Text>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};
