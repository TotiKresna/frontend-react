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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
} from '@chakra-ui/react';
import useToaster from '../components/Toaster';
import { getUsers, deleteUser } from '../api/auth';
import { useFormAccountModal } from '../modals/FormAccount';

interface User {
  _id: string;
  username: string;
  role: string;
}

interface ManageAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageAccountsModal: React.FC<ManageAccountsModalProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { showToast } = useToaster();
  const { FormAccountModal, handleOpen: handleOpenForm } = useFormAccountModal(fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Error', 'Error fetching users:', 'error');
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      fetchUsers(); // Refresh the user list
      showToast('Success','User deleted successfully','success');

    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error', 'Error deleting user:', 'error');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Accounts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Button colorScheme="blue" onClick={() => handleOpenForm()}>Create New Account</Button>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Username</Th>
                    <Th>Role</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user._id}>
                      <Td>{user.username}</Td>
                      <Td>{user.role}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button size="sm" onClick={() => handleOpenForm(user)}>Update</Button>
                          <Button size="sm" colorScheme="red" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <FormAccountModal />
    </>
  );
};

export default ManageAccountsModal;