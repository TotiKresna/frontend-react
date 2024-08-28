import { useToast } from '@chakra-ui/react';

const useToaster = () => {
  const toast = useToast();

  const showToast = (title: string, description: string, status: "success" | "error" | "warning" | "info") => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  return { showToast };
};

export default useToaster;
