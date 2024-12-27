import {
    Box,
    Image,
    Text,
    Button,
    VStack,
    HStack,
    useToast,
} from '@chakra-ui/react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const toast = useToast();

    const handleAddToCart = () => {
        onAddToCart(product);
        toast({
            title: 'Added to cart',
            description: `${product.name} has been added to your cart`,
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
        >
            <Image
                src={product.image}
                alt={product.name}
                height="200px"
                width="100%"
                objectFit="cover"
            />
            <Box p={4}>
                <VStack align="start" spacing={2}>
                    <Text fontSize="xl" fontWeight="semibold">
                        {product.name}
                    </Text>
                    <Text color="gray.600" noOfLines={2}>
                        {product.description}
                    </Text>
                    <HStack justify="space-between" width="100%">
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                            ${product.price.toFixed(2)}
                        </Text>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={handleAddToCart}
                        >
                            + au panier
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
};
