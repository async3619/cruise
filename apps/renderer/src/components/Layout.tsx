import React from 'react'

import { Global } from '@emotion/react'
import { CssBaseline } from '@mui/material'

import TitleBar from '@components/TitleBar'

import { GlobalStyles, Root } from '@components/Layout.styles'

export interface LayoutProps {}

export function Layout({ children }: React.PropsWithChildren<LayoutProps>) {
  return (
    <Root>
      <Global styles={GlobalStyles} />
      <CssBaseline />
      <TitleBar />
      {children}
    </Root>
  )
}
