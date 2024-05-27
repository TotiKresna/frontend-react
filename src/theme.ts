import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('white', 'gray.800')(props),
        
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
