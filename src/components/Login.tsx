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
  useToast, 
  Text, 
  Link,
  Flex
} from "@chakra-ui/react";
import { login, setAuthToken } from '../api/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { token, role } = await login(username, password);
      setAuthToken(token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      toast({
        title: "Login berhasil",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login gagal",
        description: "Username atau password salah",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
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
          <Heading as="h1" size="lg" mb={6}>Login</Heading>
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
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
              >
                Login
              </Button>
            </VStack>
          </form>
          <Text mt={4}>
            Belum punya akun?{" "}
            <Link as={RouterLink} to="/register" color="blue.500">
              Daftar di sini
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;