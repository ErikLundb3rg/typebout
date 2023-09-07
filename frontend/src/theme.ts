import {
  extendTheme,
  type ThemeConfig,
  withDefaultColorScheme
} from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const colors = {
  charcoal: {
    50: '#e5f6fe',
    100: '#c8e0e9',
    200: '#a8c9d7',
    300: '#87b4c6',
    400: '#669eb5',
    500: '#4d859b',
    600: '#3a6779',
    700: '#284a57',
    800: '#142c36',
    900: '#001116'
  },
  saffron: {
    50: '#fff6df',
    100: '#f6e5b8',
    200: '#efd38f',
    300: '#e8c163',
    400: '#e1b039',
    500: '#c89620',
    600: '#9c7517',
    700: '#6f540e',
    800: '#443205',
    900: '#191100'
  },
  burntSienna: {
    50: '#ffe9e4',
    100: '#fac6ba',
    200: '#f1a28e',
    300: '#e97d62',
    400: '#e25936',
    500: '#c9401d',
    600: '#9d3116',
    700: '#71220e',
    800: '#451306',
    900: '#1d0400'
  },
  persianGreen: {
    50: '#dffdf9',
    100: '#bef0e9',
    200: '#98e4db',
    300: '#72d9cd',
    400: '#4ecfbe',
    500: '#35b5a5',
    600: '#268d80',
    700: '#17655c',
    800: '#053d37',
    900: '#001613'
  },
  sandyBrown: {
    50: '#fff0de',
    100: '#fdd4b3',
    200: '#f8b987',
    300: '#f39d58',
    400: '#ef812a',
    500: '#d66711',
    600: '#a7500c',
    700: '#783907',
    800: '#4a2101',
    900: '#1e0800'
  },
  typeboutGray: {
    50: '#EEEEEE',
    100: '#d9d9d9',
    200: '#bfbfbf',
    300: '#a6a6a6',
    400: '#8c8c8c',
    500: '#737373',
    600: '#595959',
    700: '#404040',
    800: '#262626',
    900: '#120b0d'
  }
}

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true
}

// 3. extend the theme
export const theme = extendTheme(
  {
    ...config,
    colors,
    fonts: {
      body: `'Open Sans', sans-serif`,
      heading: `'Montserrat', sans-serif`
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          fontFamily: 'body',
          lineHeight: 'base'
        },
        a: {
          _hover: {
            textDecoration: 'underline'
          }
        }
      })
    }
  },
  withDefaultColorScheme({ colorScheme: 'typeboutGray' })
)
