import React from 'react'
import { Outlet } from 'react-router-dom'

import { Global } from '@emotion/react'
import { CssBaseline } from '@mui/material'

import TitleBar from '@components/TitleBar'
import Navigator from '@components/Navigator'

import * as Styled from '@components/Layout.styles'

export function Layout() {
  return (
    <Styled.Root>
      <Global styles={Styled.GlobalStyles} />
      <CssBaseline />
      <TitleBar />
      <Navigator />
      <Styled.Content>
        <Outlet />
      </Styled.Content>
    </Styled.Root>
  )
}
