import { Spinner, Flex } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Flex justify="center" align="center" height="100vh">
      <Spinner size="xl" />
    </Flex>
  );
};

export default Loader;
