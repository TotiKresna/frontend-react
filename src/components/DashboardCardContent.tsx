import React from 'react';
import { Box, SimpleGrid, Text, Heading, useColorModeValue } from '@chakra-ui/react';

const opmFields = ['opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'] as const;

interface CardContentProps {
  title: string;
  data: Record<string, number>;
}

export const CardContent: React.FC<CardContentProps> = ({ title, data }) => {
  const dataColors = [
    useColorModeValue('blue.100', 'blue.700'),
    useColorModeValue('green.100', 'green.700'),
    useColorModeValue('yellow.100', 'yellow.700'),
    useColorModeValue('orange.100', 'orange.700'),
    useColorModeValue('red.100', 'red.700'),
  ];

  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        {title}
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
        {opmFields.map((field, index) => (
          <Box
            key={field}
            p={3}
            borderRadius="md"
            boxShadow="sm"
            bg={dataColors[index]}
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <Text fontWeight="bold">{field.replace('opm_', 'OPM ')}</Text>
            <Text fontSize="xl">{data[field]}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};