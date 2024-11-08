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
import { FiHome, FiUsers, FiFileText, FiMenu, FiUpload, FiBook } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfileMenu } from './ProfileMenu';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  roles?: string[];
  position?: 'top' | 'bottom';
  isExternal?: boolean;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, route: '/dashboard', position: 'top' },
  { name: 'Data Siswa', icon: FiUsers, route: '/students', position: 'top' },
  { name: 'Data Nilai', icon: FiFileText, route: '/test-results', position: 'top' },
  { name: 'Import Nilai', icon: FiUpload, route: '/import', roles: ['superadmin', 'admin'], position: 'top' },
  { 
    name: 'API Documentation', 
    icon: FiBook, 
    route: `${API_URL}/api-docs`, 
    position: 'bottom',
    isExternal: true 
  }
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshContent = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <Box 
      minH="100vh" 
      bg={useColorModeValue('whiteAlpha.700', 'blackAlpha.700')}
      backgroundImage="url('/images/quad.svg')"
      backgroundSize="cover"
      backgroundPosition="bottom"
      backgroundRepeat="no-repeat"
    >
      <SidebarContent onClose={onClose} refreshContent={refreshContent} display={{ base: 'none', md: 'block' }} />
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
          <SidebarContent onClose={onClose} refreshContent={refreshContent} />
        </DrawerContent>
      </Drawer>
      {/* Mobile nav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
      {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { key: refreshKey })
            : child
      )}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  refreshContent: () => void;
}

const SidebarContent = ({ onClose, refreshContent, ...rest }: SidebarProps) => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUserRole = localStorage.getItem('role');
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const topNavItems = LinkItems.filter(item => item.position !== 'bottom');
  const bottomNavItems = LinkItems.filter(item => item.position === 'bottom');

  return (
    <Box
      bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.800')}
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
          style={{ width: '50px', height: '50px' }}
        />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      {/* Top Navigation Items */}
      <Flex direction="column" flex="1">
        <Box>
          {topNavItems.map((link) => {
            if (!link.roles || (link.roles.includes(userRole))) {
              return (
                <NavItem 
                  fontWeight="550" 
                  key={link.name} 
                  icon={link.icon} 
                  route={link.route} 
                  onClose={onClose} 
                  refreshContent={refreshContent}
                >
                  {link.name}
                </NavItem>
              );
            }
            return null;
          })}
        </Box>
        
        {/* Bottom Navigation Items */}
        <Box position="absolute" bottom="5" width="100%">
          {bottomNavItems.map((link) => (
            <NavItem
              fontWeight="550"
              key={link.name}
              icon={link.icon}
              route={link.route}
              onClose={onClose}
              refreshContent={refreshContent}
            >
              {link.name}
            </NavItem>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  route: string;
  children: React.ReactNode;
  onClose: () => void;
  refreshContent: () => void;
}

const NavItem = ({ icon, route, children, onClose, refreshContent, ...rest }: NavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === route;
  const isExternal = route.startsWith('http') || route.startsWith(API_URL);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isExternal) {
      window.open(route, '_blank');
    } else if (isActive) {
      refreshContent();
    } else {
      navigate(route);
    }
    onClose();
  };

  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="md"
      role="group"
      cursor="pointer"
      color={isActive ? 'teal.400' : 'gray.500'}
      onClick={handleClick}
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
      bg={useColorModeValue('whiteAlpha.700', 'blackAlpha.700')}
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