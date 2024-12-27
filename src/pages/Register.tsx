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
    Select,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
    role: Yup.string().oneOf(['CLIENT', 'VENDOR']).required('Required'),
});

export const Register = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    return (
        <Box maxW="md" mx="auto" mt={8}>
            <VStack spacing={8}>
                <Heading>Register</Heading>
                <Formik
                    initialValues={{ name: '', email: '', password: '', role: 'CLIENT' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, actions) => {
                        try {
                            const response = await auth.register(values);
                            login(response.data.user, response.data.token);
                            toast({
                                title: 'Registration Successful',
                                status: 'success',
                                duration: 3000,
                            });
                            navigate('/');
                        } catch (error: any) {
                            toast({
                                title: 'Registration Failed',
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
                                <Field name="name">
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                                            <FormLabel>Name</FormLabel>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                    )}
                                </Field>
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
                                <Field name="role">
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.role && form.touched.role}>
                                            <FormLabel>Account Type</FormLabel>
                                            <Select {...field}>
                                                <option value="CLIENT">Client</option>
                                                <option value="VENDOR">Vendor</option>
                                            </Select>
                                        </FormControl>
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="100%"
                                    isLoading={props.isSubmitting}
                                >
                                    Register
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
                <Text>
                    Already have an account?{' '}
                    <Link as={RouterLink} to="/login" color="blue.500">
                        Login here
                    </Link>
                </Text>
            </VStack>
        </Box>
    );
};
