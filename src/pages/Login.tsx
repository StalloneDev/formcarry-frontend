import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    Link,
    useToast,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

export const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    return (
        <Box maxW="md" mx="auto" mt={8} px={4}>
            <VStack spacing={8}>
                <Heading>Connexion</Heading>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, actions) => {
                        try {
                            const response = await auth.login(values);
                            if (response.data && response.data.user && response.data.token) {
                                login(response.data.user, response.data.token);
                                toast({
                                    title: 'Connexion réussie',
                                    status: 'success',
                                    duration: 3000,
                                });
                                navigate('/');
                            } else {
                                throw new Error('Invalid response format');
                            }
                        } catch (error: any) {
                            console.error('Login error:', error);
                            toast({
                                title: 'Échec de la connexion',
                                description: error.response?.data?.error || 'Une erreur est survenue',
                                status: 'error',
                                duration: 3000,
                            });
                        } finally {
                            actions.setSubmitting(false);
                        }
                    }}
                >
                    {(props) => (
                        <Form style={{ width: '100%' }}>
                            <VStack spacing={4}>
                                <Field name="email">
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                                            <FormLabel>Email</FormLabel>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                                            <FormLabel>Mot de passe</FormLabel>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="100%"
                                    isLoading={props.isSubmitting}
                                >
                                    Se connecter
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
                <Text>
                    Pas encore de compte ?{' '}
                    <Link as={RouterLink} to="/register" color="blue.500">
                        Inscrivez-vous ici
                    </Link>
                </Text>
            </VStack>
        </Box>
    );
};
