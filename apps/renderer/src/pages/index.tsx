import React from 'react'
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import { Layout } from '@components/Layout'

import { Home } from '@pages/Home'
import { Search } from '@pages/Search'

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Layout />}
    >
      <Route
        index
        element={<Home />}
      />
      <Route
        path="search"
        element={<Search />}
      />
    </Route>,
  ),
)

export function Routes() {
  return <RouterProvider router={router} />
}
