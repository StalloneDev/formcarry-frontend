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
    VStack
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
        <Box position="relative">
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
                <Stack
                    direction={'row'}
                    spacing={4}
                    display={{ base: 'none', md: 'flex' }}
                >
                    <Box
                        as={RouterLink}
                        to="/products"
                        px={3}
                        py={2}
                        rounded={'md'}
                        _hover={{
                            bg: useColorModeValue('gray.100', 'gray.700')
                        }}
                    >
                        Produits
                    </Box>
                </Stack>

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
                                        colorScheme="blue"
                                        position="absolute"
                                        top="-2"
                                        right="-2"
                                        fontSize="xs"
                                        borderRadius="full"
                                        minW="1.5em"
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
                            <MenuList zIndex={2}>
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
                                display={{ base: 'none', md: 'inline-flex' }}
                            >
                                Connexion
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/register"
                                colorScheme="blue"
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
                    position="absolute"
                    w="100%"
                    zIndex={10}
                    bg={useColorModeValue('white', 'gray.800')}
                    shadow="lg"
                    px={4}
                    py={4}
                    display={{ md: 'none' }}
                >
                    <VStack spacing={3} align="stretch">
                        <Box
                            as={RouterLink}
                            to="/products"
                            px={3}
                            py={2}
                            rounded="md"
                            _hover={{
                                bg: useColorModeValue('gray.100', 'gray.700')
                            }}
                        >
                            Produits
                        </Box>
                        {!isAuthenticated && (
                            <>
                                <Box
                                    as={RouterLink}
                                    to="/login"
                                    px={3}
                                    py={2}
                                    rounded="md"
                                    _hover={{
                                        bg: useColorModeValue('gray.100', 'gray.700')
                                    }}
                                >
                                    Connexion
                                </Box>
                                <Box
                                    as={RouterLink}
                                    to="/register"
                                    px={3}
                                    py={2}
                                    rounded="md"
                                    bg="blue.500"
                                    color="white"
                                    _hover={{
                                        bg: 'blue.600'
                                    }}
                                >
                                    Inscription
                                </Box>
                            </>
                        )}
                    </VStack>
                </Box>
            </Collapse>
        </Box>
    );
};
