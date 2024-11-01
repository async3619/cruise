import { createTheme } from '@mui/material'

declare module '@emotion/react' {
  export interface Theme extends ReturnType<typeof createTheme> {}
}
