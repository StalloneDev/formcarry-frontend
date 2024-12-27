import {
    Box,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Heading,
    Container,
} from '@chakra-ui/react';
import { ProductsManagement } from './ProductsManagement';
import { OrdersManagement } from './OrdersManagement';
import { Settings } from './Settings';

export const Dashboard = () => {
    return (
        <Container maxW="container.xl">
            <Box py={8}>
                <Heading mb={6}>Vendor Dashboard</Heading>
                <Tabs isLazy>
                    <TabList>
                        <Tab>Products</Tab>
                        <Tab>Orders</Tab>
                        <Tab>Settings</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <ProductsManagement />
                        </TabPanel>
                        <TabPanel>
                            <OrdersManagement />
                        </TabPanel>
                        <TabPanel>
                            <Settings />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};
