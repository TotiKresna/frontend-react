import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Icon,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, LockIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('role');
    if (storedUsername) setUserName(storedUsername);
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>Logo</Box>

        <Flex alignItems={'center'}>
          <Menu closeOnSelect={false}>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    bg= 'grey'
                    src={'https://bit.ly/broken-link'}
                  />
                </MenuButton>
                <MenuList>
                  <Box px={3} py={2}>
                    <Text fontWeight="bold">{userName}</Text>
                  </Box>
                  <MenuItem 
                    onClick={toggleColorMode}
                    closeOnSelect={false}
                  >
                    <Icon as={colorMode === 'light' ? MoonIcon : SunIcon} mr={2} />
                    Change Theme
                  </MenuItem>
                  {userRole === 'superadmin' && (
                    <MenuItem onClick={() => navigate('/admin-register')}>
                      <Icon as={AddIcon} mr={2} />
                      Create Admin Account
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Icon as={LockIcon} mr={2} />
                    Logout
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}