import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
    Image,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
    Text,
    Flex,
    SimpleGrid,
    Badge,
    ButtonGroup,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { products } from '../../services/api';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    vendorId: string;
}

const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Trop court!')
        .max(50, 'Trop long!')
        .required('Requis'),
    description: Yup.string()
        .min(10, 'Trop court!')
        .max(500, 'Trop long!')
        .required('Requis'),
    price: Yup.number()
        .positive('Doit être positif')
        .required('Requis'),
    image: Yup.string()
        .url('Doit être une URL valide')
        .required('Requis'),
});

export const ProductsManagement = () => {
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const fetchProducts = async () => {
        try {
            const response = await products.getAll();
            setProductsList(response.data);
        } catch (error: any) {
            toast({
                title: 'Erreur de récupération des produits',
                description: error.response?.data?.message || 'Erreur inconnue',
                status: 'error',
                duration: 3000,
            });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (values: Omit<Product, 'id' | 'vendorId'>, { resetForm }: any) => {
        try {
            console.log('Soumission des valeurs:', values);
            if (selectedProduct) {
                await products.update(selectedProduct.id, values);
                toast({
                    title: 'Produit mis à jour',
                    status: 'success',
                    duration: 3000,
                });
            } else {
                const response = await products.create(values);
                console.log('Réponse du serveur:', response);
                toast({
                    title: 'Produit créé',
                    status: 'success',
                    duration: 3000,
                });
            }
            fetchProducts();
            resetForm();
            onClose();
        } catch (error: any) {
            console.error('Détails de l\'erreur:', error);
            console.error('Données de la réponse:', error.response?.data);
            toast({
                title: 'Erreur',
                description: error.response?.data?.details || error.response?.data?.error || error.message || 'Erreur inconnue',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
            try {
                await products.delete(id);
                toast({
                    title: 'Produit supprimé',
                    status: 'success',
                    duration: 3000,
                });
                fetchProducts();
            } catch (error: any) {
                toast({
                    title: 'Erreur de suppression du produit',
                    description: error.response?.data?.message || 'Erreur inconnue',
                    status: 'error',
                    duration: 3000,
                });
            }
        }
    };

    return (
        <Box>
            <Box mb={5} display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="lg">Gestion des Produits</Heading>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="brand"
                    onClick={() => {
                        setSelectedProduct(null);
                        onOpen();
                    }}
                >
                    Ajouter un produit
                </Button>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {productsList.map((product) => (
                    <Box
                        key={product.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            height="200px"
                            width="100%"
                            objectFit="cover"
                        />

                        <Box p="6">
                            <Box d="flex" alignItems="baseline">
                                <Badge borderRadius="full" px="2" colorScheme="brand">
                                    {product.price.toLocaleString('fr-FR')} XOF
                                </Badge>
                            </Box>

                            <Box
                                mt="1"
                                fontWeight="semibold"
                                as="h4"
                                lineHeight="tight"
                            >
                                {product.name}
                            </Box>

                            <Text mt={2} color="gray.600">
                                {product.description}
                            </Text>

                            <ButtonGroup mt={4} size="sm" spacing={4}>
                                <Button
                                    leftIcon={<EditIcon />}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        onOpen();
                                    }}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    leftIcon={<DeleteIcon />}
                                    colorScheme="red"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Supprimer
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={selectedProduct || {
                                name: '',
                                description: '',
                                price: 0,
                                image: '',
                            }}
                            validationSchema={ProductSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <VStack spacing={4}>
                                        <FormControl isInvalid={!!errors.name && touched.name}>
                                            <FormLabel>Nom du produit</FormLabel>
                                            <Field
                                                as={Input}
                                                name="name"
                                                placeholder="Nom du produit"
                                            />
                                            {errors.name && touched.name && (
                                                <Text color="red.500" fontSize="sm">{errors.name}</Text>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.description && touched.description}>
                                            <FormLabel>Description</FormLabel>
                                            <Field
                                                as={Textarea}
                                                name="description"
                                                placeholder="Description du produit"
                                            />
                                            {errors.description && touched.description && (
                                                <Text color="red.500" fontSize="sm">{errors.description}</Text>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.price && touched.price}>
                                            <FormLabel>Prix (XOF)</FormLabel>
                                            <Field name="price">
                                                {({ field, form }) => (
                                                    <NumberInput
                                                        {...field}
                                                        onChange={(value) => form.setFieldValue(field.name, Number(value))}
                                                        min={0}
                                                    >
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                )}
                                            </Field>
                                            {errors.price && touched.price && (
                                                <Text color="red.500" fontSize="sm">{errors.price}</Text>
                                            )}
                                        </FormControl>

                                        <FormControl isInvalid={!!errors.image && touched.image}>
                                            <FormLabel>URL de l'image</FormLabel>
                                            <Field
                                                as={Input}
                                                name="image"
                                                placeholder="URL de l'image"
                                            />
                                            {errors.image && touched.image && (
                                                <Text color="red.500" fontSize="sm">{errors.image}</Text>
                                            )}
                                        </FormControl>

                                        <Box w="100%" pt={4}>
                                            <Button type="submit" colorScheme="brand" w="100%">
                                                {selectedProduct ? 'Mettre à jour' : 'Ajouter'}
                                            </Button>
                                        </Box>
                                    </VStack>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};
