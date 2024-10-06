import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('whiteAlpha', 'gray.800')(props),
        backgroundImage: mode(
          "url('/images/quad.svg')",
          "url('/images/quad.svg')"
        )(props),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  breakpoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
  fontWeight: {
    body: '500'
  },
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
  components: {
    Container: {
      baseStyle: (props: any) => ({
        backgroundColor: mode('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')(props),
        backdropFilter: 'blur(10px)',
        borderRadius: 'lg',
        boxShadow: mode(
          '0 4px 6px rgba(0, 0, 0, 0.1)',
          '0 4px 6px rgba(255, 255, 255, 0.1)'
        )(props),
      }),
    },
  },
});

export default theme;