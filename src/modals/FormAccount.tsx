import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import useToaster from '../components/Toaster';
import { createUser, updateUser } from '../api/auth';

interface User {
  _id: string;
  username: string;
  role: string;
}

export const useFormAccountModal = (onSuccess: () => void) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const formRef = useRef({
    username: '',
    password: '',
    role: '',
  });
  const { showToast } = useToaster();

  const resetForm = useCallback((selectedUser: User | null) => {
    if (selectedUser) {
      formRef.current = {
        username: selectedUser.username,
        password: '',
        role: selectedUser.role,
      };
    } else {
      formRef.current = {
        username: '',
        password: '',
        role: '',
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm(user);
    }
  }, [isOpen, user, resetForm]);

  const handleOpen = useCallback((selectedUser: User | null = null) => {
    if (selectedUser) {
      setUser(selectedUser);
    } else {
      setUser(null);
    }
    resetForm(selectedUser);
    onOpen();
  }, [onOpen, resetForm]);

  const handleClose = useCallback(() => {
    setUser(null);
    resetForm(null);
    onClose();
  }, [onClose, resetForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    formRef.current[name as keyof typeof formRef.current] = value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await updateUser(user._id, formRef.current.username, formRef.current.password, formRef.current.role);
        showToast('Success', 'User updated successfully', 'success');
      } else {
        await createUser(formRef.current.username, formRef.current.password, formRef.current.role);
        showToast('Success', 'User created successfully', 'success');
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error submitting user form:', error);
      showToast('Error', `Error ${user ? 'updating' : 'creating'} user`, 'error');
    }
  };

  const FormAccountModal = React.memo(() => (
    <Modal isOpen={isOpen} onClose={handleClose}>
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
                  name="username"
                  defaultValue={formRef.current.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                />
              </FormControl>
              <FormControl isRequired={!user}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  defaultValue={formRef.current.password}
                  onChange={handleChange}
                  placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  defaultValue={formRef.current.role}
                  onChange={handleChange}
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
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  ));

  return { FormAccountModal, handleOpen };
};