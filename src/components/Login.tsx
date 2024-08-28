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
  Flex,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUser, FaLock } from 'react-icons/fa';
import { login, setAuthToken } from '../api/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Flex 
      minHeight="100vh" 
      width="100wh" 
      align="center" 
      justifyContent="center"
      bgColor="gray.500"
    >
      <Box 
        borderWidth={1}
        px={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
        bg={useColorModeValue('whiteAlpha.800', 'gray.900')}
      >
        <Avatar mt="4" bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box p={4}>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaUser color="gray.300" />
                  </InputLeftElement>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaLock color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={togglePasswordVisibility}
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                type="submit"
                colorScheme="orange"
                width="full"
                isLoading={isLoading}
              >
                Login
              </Button>
            </VStack>
          </form>
          <Text mt={4}>
            Belum punya akun?{" "}
            <Link as={RouterLink} to="/register" color="orange.500">
              Daftar di sini
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}