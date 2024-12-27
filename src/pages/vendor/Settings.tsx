import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
    Text,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { vendor } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const Settings = () => {
    const [kkiapayId, setKkiapayId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { user } = useAuth();

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                // TODO: Add API endpoint to fetch vendor details including KKiaPay ID
                // const response = await vendor.getDetails();
                // setKkiapayId(response.data.kkiapayId || '');
            } catch (error) {
                console.error('Error fetching vendor details:', error);
            }
        };

        fetchVendorDetails();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await vendor.updateKkiapayId(kkiapayId);
            toast({
                title: 'Settings updated',
                description: 'Your KKiaPay ID has been updated successfully',
                status: 'success',
                duration: 3000,
            });
        } catch (error: any) {
            toast({
                title: 'Error updating settings',
                description: error.response?.data?.error || 'An error occurred',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box maxW="md">
            <VStack spacing={6} align="stretch">
                <Text fontSize="xl" fontWeight="bold">
                    Vendor Settings
                </Text>

                <Alert status="info">
                    <AlertIcon />
                    Configure your KKiaPay ID to start accepting payments
                </Alert>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>KKiaPay ID</FormLabel>
                            <Input
                                value={kkiapayId}
                                onChange={(e) => setKkiapayId(e.target.value)}
                                placeholder="Enter your KKiaPay ID"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            isLoading={isLoading}
                            width="100%"
                        >
                            Save Settings
                        </Button>
                    </VStack>
                </form>

                <Alert status="warning">
                    <AlertIcon />
                    Make sure to enter a valid KKiaPay ID to ensure proper payment processing
                </Alert>
            </VStack>
        </Box>
    );
};
