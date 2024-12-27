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
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Text
                        as={RouterLink}
                        to="/"
                        textAlign={{ base: 'center', md: 'left' }}
                        fontFamily={'heading'}
                        color={useColorModeValue('gray.800', 'white')}
                        fontSize="xl"
                        fontWeight="bold"
                    >
                        KJS-Shop
                    </Text>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <Stack direction={'row'} spacing={4}>
                            <Box>
                                <Popover trigger={'hover'} placement={'bottom-start'}>
                                    <PopoverTrigger>
                                        <Link
                                            p={2}
                                            href={'#'}
                                            fontSize={'sm'}
                                            fontWeight={500}
                                            color={useColorModeValue('gray.600', 'gray.200')}
                                            _hover={{
                                                textDecoration: 'none',
                                                color: useColorModeValue('gray.800', 'white'),
                                            }}
                                        >
                                            Catégories
                                            <Icon as={ChevronDownIcon} />
                                        </Link>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        border={0}
                                        boxShadow={'xl'}
                                        bg={useColorModeValue('white', 'gray.800')}
                                        p={4}
                                        rounded={'xl'}
                                        minW={'sm'}
                                    >
                                        <Stack>
                                            <Box
                                                as={RouterLink}
                                                to="/products"
                                                role={'group'}
                                                p={2}
                                                rounded={'md'}
                                                _hover={{ bg: useColorModeValue('brand.50', 'gray.900') }}
                                            >
                                                <Stack direction={'row'} align={'center'}>
                                                    <Box>
                                                        <Text
                                                            transition={'all .3s ease'}
                                                            _groupHover={{ color: 'brand.500' }}
                                                            fontWeight={500}
                                                        >
                                                            Tous les produits
                                                        </Text>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </PopoverContent>
                                </Popover>
                            </Box>
                        </Stack>
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}
                    align="center"
                >
                    <Button
                        as={RouterLink}
                        to="/cart"
                        variant="ghost"
                        size="sm"
                        leftIcon={<FaShoppingCart />}
                        position="relative"
                    >
                        Panier
                        {items.length > 0 && (
                            <Badge
                                colorScheme="brand"
                                position="absolute"
                                top="-1"
                                right="-1"
                                borderRadius="full"
                            >
                                {items.length}
                            </Badge>
                        )}
                    </Button>

                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                <HStack spacing={1}>
                                    <Icon as={FaUser} />
                                    <Text>{user?.name}</Text>
                                </HStack>
                            </MenuButton>
                            <MenuList>
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
                        <HStack spacing={4}>
                            <Button
                                as={RouterLink}
                                to="/login"
                                fontSize={'sm'}
                                fontWeight={400}
                                variant={'link'}
                            >
                                Se connecter
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/register"
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'brand.500'}
                                _hover={{
                                    bg: 'brand.400',
                                }}
                            >
                                S'inscrire
                            </Button>
                        </HStack>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
};
