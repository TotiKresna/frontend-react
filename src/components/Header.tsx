import React from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useProfileMenu } from './ProfileMenu';

export default function Header() {
  const { ProfileMenu } = useProfileMenu();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('whiteAlpha.100', 'blackAlpha.100');

    // Jika dalam mode mobile, tidak render apapun
    if (isMobile) {
      return null;
    }

  return (
    <Box 
      bg={bgColor} 
      px={4}
      >
      <Flex h={16} alignItems={'center'} justifyContent={'flex-end'}>
        <Flex alignItems={'center'}>
        <ProfileMenu />
        </Flex>
      </Flex>
    </Box>
  );
}