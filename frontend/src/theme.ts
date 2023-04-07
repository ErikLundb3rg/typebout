import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

// 3. extend the theme
export const theme = extendTheme({
  ...config,
  colors: {
    cyan: '#30E3CA'
  }
})
