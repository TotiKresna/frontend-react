import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { createUser, updateUser } from '../api/auth';

interface User {
  _id: string;
  username: string;
  role: string;
}

export const useFormAccountModal = (onSuccess: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(user.role);
    } else {
      setUsername('');
      setPassword('');
      setRole('');
    }
  }, [user]);

  const handleOpen = (selectedUser: User | null = null) => {
    setUser(selectedUser);
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await updateUser(user._id, username, password, role);
        toast({
          title: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createUser(username, password, role);
        toast({
          title: 'User created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting user form:', error);
      toast({
        title: `Error ${user ? 'updating' : 'creating'} user`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const FormAccountModal = () => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{user ? 'Update User' : 'Create User'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </FormControl>
              <FormControl isRequired={!user}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Select role"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option disabled value="superadmin">Superadmin</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              {user ? 'Update' : 'Create'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );

  return { FormAccountModal, handleOpen };
};