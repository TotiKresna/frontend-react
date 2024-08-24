import React from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useProfileMenu } from '../hooks/ProfileMenu';

export default function Header() {
  const { ProfileMenu } = useProfileMenu();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'flex-end'}>
        <Flex alignItems={'center'}>
          {!isMobile && <ProfileMenu />}
        </Flex>
      </Flex>
    </Box>
  );
}