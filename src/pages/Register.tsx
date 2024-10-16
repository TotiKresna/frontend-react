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
  FormErrorMessage,
  useColorModeValue
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

  const bgColor = useColorModeValue('whiteAlpha.800', 'blackAlpha.800');

  return (
    <Flex 
      minHeight="100vh" 
      width="full" 
      align="center" 
      justifyContent="center"
      backgroundImage="url('/images/quad.svg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Box 
        bg={bgColor}
        px={8}
        py={8}
        m={4}
        width="full"
        borderWidth={1}
        maxWidth="480px"
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
      >
        <Heading color="orange.400" as="h1" size="xl" mb={6}>Register</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                bg={useColorModeValue('white', 'gray.900')}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                bg={useColorModeValue('white', 'gray.900')}
              />
            </FormControl>
            <FormControl isRequired isInvalid={!!passwordError}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                bg={useColorModeValue('white', 'gray.900')}
              />
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              colorScheme="orange"
              width="full"
              isLoading={isLoading}
            >
              Register
            </Button>
          </VStack>
        </form>
        <Text mt={4}>
          Sudah punya akun?{" "}
          <Link as={RouterLink} to="/login" color="orange.500">
            Login di sini
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;