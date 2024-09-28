import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Box, 
  Heading, 
  Text, 
  Link,
  Flex,
  FormErrorMessage
} from "@chakra-ui/react";
import useToaster from "../components/Toaster";
import { register, setAuthToken } from '../api/auth';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToaster();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    setIsLoading(true);
    try {
      // Assuming the backend expects a role, we'll send 'user' as default
      const { token } = await register(username, password, 'user');
      setAuthToken(token);
      showToast("Registrasi berhasil", "Silahkan Login terlebih dahulu", "success");
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      showToast("Registrasi gagal", "Silakan coba lagi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box 
        borderWidth={1}
        px={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box p={4}>
          <Heading as="h1" size="lg" mb={6}>Register</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </FormControl>
              <FormControl isRequired isInvalid={!!passwordError}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Register
              </Button>
            </VStack>
          </form>
          <Text mt={4}>
            Sudah punya akun?{" "}
            <Link as={RouterLink} to="/login" color="blue.500">
              Login di sini
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Register;