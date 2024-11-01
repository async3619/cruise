import React from 'react'

import { ThemeProvider } from '@mui/material'

import { ApolloProvider } from '@apollo/client'
import apolloClient from '@graphql/client'

import { darkTheme } from '@styles/theme'

import { Routes } from '@pages'

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={darkTheme}>
        <Routes />
      </ThemeProvider>
    </ApolloProvider>
  )
}
