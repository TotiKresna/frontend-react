import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorMode,
  Icon,
  Text,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, LockIcon, SettingsIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import ManageAccountsModal from '../modals/ManageAccounts';

export const useProfileMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const { isOpen: isManageAccountsOpen, onOpen: onManageAccountsOpen, onClose: onManageAccountsClose } = useDisclosure();

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

  const ProfileMenu = () => (
    <>
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
                bg='grey'
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
                <MenuItem onClick={onManageAccountsOpen}>
                  <Icon as={SettingsIcon} mr={2} />
                  Manage Accounts
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
      {userRole === 'superadmin' && (
        <ManageAccountsModal isOpen={isManageAccountsOpen} onClose={onManageAccountsClose} />
      )}
    </>
  );

  return { ProfileMenu, userRole };
};