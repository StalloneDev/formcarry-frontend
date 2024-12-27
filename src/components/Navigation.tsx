import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Badge,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaStore } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { HStack } from '@chakra-ui/react'

export const Navigation = () => {
    const { isOpen, onToggle } = useDisclosure();
    const { isAuthenticated, user, logout } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}
                justify="space-between"
            >
                {/* Menu Hamburger pour mobile */}
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onToggle}
                    icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                    variant={'ghost'}
                    aria-label={'Toggle Navigation'}
                    size="md"
                />

                {/* Logo */}
                <Text
                    as={RouterLink}
                    to="/"
                    fontFamily={'heading'}
                    color={useColorModeValue('gray.800', 'white')}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="bold"
                >
                    KJS-Shop
                </Text>

                {/* Navigation Desktop */}
                <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                    <Stack direction={'row'} spacing={4}>
                        <RouterLink to="/products">
                            <Text px={2} py={1} rounded={'md'} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                                Produits
                            </Text>
                        </RouterLink>
                    </Stack>
                </Flex>

                {/* Actions (Panier & Profil) */}
                <HStack spacing={{ base: 2, md: 4 }}>
                    <IconButton
                        as={RouterLink}
                        to="/cart"
                        variant="ghost"
                        size="md"
                        icon={
                            <Box position="relative">
                                <FaShoppingCart />
                                {items.length > 0 && (
                                    <Badge
                                        colorScheme="brand"
                                        position="absolute"
                                        top="-2"
                                        right="-2"
                                        fontSize="xs"
                                        borderRadius="full"
                                    >
                                        {items.length}
                                    </Badge>
                                )}
                            </Box>
                        }
                        aria-label="Panier"
                    />

                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<FaUser />}
                                variant="ghost"
                                size="md"
                                aria-label="Menu utilisateur"
                            />
                            <MenuList>
                                <Text px={3} py={2} fontWeight="medium" color="gray.500">
                                    {user?.name}
                                </Text>
                                {user?.role === 'VENDOR' && (
                                    <MenuItem
                                        as={RouterLink}
                                        to="/vendor"
                                        icon={<FaStore />}
                                    >
                                        Tableau de bord
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => {
                                    logout();
                                    navigate('/');
                                }}>
                                    Déconnexion
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <HStack spacing={2}>
                            <Button
                                as={RouterLink}
                                to="/login"
                                variant="ghost"
                                size={{ base: "sm", md: "md" }}
                            >
                                Connexion
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/register"
                                colorScheme="brand"
                                size={{ base: "sm", md: "md" }}
                                display={{ base: 'none', md: 'inline-flex' }}
                            >
                                Inscription
                            </Button>
                        </HStack>
                    )}
                </HStack>
            </Flex>

            {/* Menu Mobile */}
            <Collapse in={isOpen} animateOpacity>
                <Box
                    p={4}
                    display={{ md: 'none' }}
                    bg={useColorModeValue('white', 'gray.800')}
                    shadow="md"
                >
                    <Stack spacing={4}>
                        <Box
                            as={RouterLink}
                            to="/products"
                            py={2}
                            px={4}
                            rounded="md"
                            _hover={{
                                bg: useColorModeValue('gray.100', 'gray.700'),
                            }}
                        >
                            Produits
                        </Box>
                        {!isAuthenticated && (
                            <Box
                                as={RouterLink}
                                to="/register"
                                py={2}
                                px={4}
                                rounded="md"
                                bg="brand.500"
                                color="white"
                                _hover={{
                                    bg: 'brand.600',
                                }}
                            >
                                Inscription
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
};
