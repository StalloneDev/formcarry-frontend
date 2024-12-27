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
        <Box maxW="md" mx="auto" mt={8}>
            <VStack spacing={8}>
                <Heading>Login</Heading>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, actions) => {
                        try {
                            const response = await auth.login(values);
                            login(response.data.user, response.data.token);
                            toast({
                                title: 'Login Successful',
                                status: 'success',
                                duration: 3000,
                            });
                            navigate('/');
                        } catch (error: any) {
                            toast({
                                title: 'Login Failed',
                                description: error.response?.data?.error || 'An error occurred',
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
                                            <FormLabel>Password</FormLabel>
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
                                    Login
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
                <Text>
                    Don't have an account?{' '}
                    <Link as={RouterLink} to="/register" color="blue.500">
                        Register here
                    </Link>
                </Text>
            </VStack>
        </Box>
    );
};
