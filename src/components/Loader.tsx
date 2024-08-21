import { Flex } from '@chakra-ui/react';
import { trefoil } from 'ldrs'

trefoil.register()

const Loader = () => {
  return (
    <Flex justify="center" align="center" height="100vh">
      <l-trefoil
        size="40"
        stroke="4"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.4" 
        color="blue" 
      ></l-trefoil>
    </Flex>
  );
};

export default Loader;
