import React, { ReactNode, useState, useEffect  } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { FiHome, FiUsers, FiFileText, FiMenu, FiUpload } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';
import { useProfileMenu } from './ProfileMenu';

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  roles?: string[];
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, route: '/dashboard' },
  { name: 'Data Siswa', icon: FiUsers, route: '/students' },
  { name: 'Data Nilai', icon: FiFileText, route: '/test-results' },
  { name: 'Import Excel', icon: FiUpload, route: '/import', roles: ['superadmin', 'admin'] }
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent maxW="250px">
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* Mobile nav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <img 
          src="/logo192.png" 
          alt="Logo" 
          style={{ width: '50px', height: '50px' }} // Sesuaikan ukuran sesuai kebutuhan
        />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        if (!link.roles || ( link.roles.includes(userRole))) {
          return (
            <NavItem fontWeight="550" key={link.name} icon={link.icon} route={link.route} onClose={onClose}>
              {link.name}
            </NavItem>
          );
        }
        return(null)
      })}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  route: string;
  children: React.ReactNode;
  onClose: () => void;
}

const NavItem = ({ icon, route, children, onClose, ...rest }: NavItemProps) => {
  return (
    <NavLink
      to={route}
      style={{ textDecoration: 'none', width: '100%' }}
      onClick={onClose}
    >
      {({ isActive }) => (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="md"
          role="group"
          cursor="pointer"
          color={isActive ? 'teal.400' : 'gray.500'}
          _hover={{
            bg: 'transparent',
            color: 'gray.400',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'gray.500',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </NavLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { ProfileMenu } = useProfileMenu();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="space-between"
      position="sticky"
      top={0}
      zIndex={1000}
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />
      <ProfileMenu />
    </Flex>
  );
};