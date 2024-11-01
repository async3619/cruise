import React from 'react'

import HomeRounded from '@mui/icons-material/HomeRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'

import { SvgIconProps } from '@mui/material'

export interface NavigatorItem {
  icon: React.ComponentType<SvgIconProps>
  label: string
  path: string
}

export const NAVIGATOR_ITEMS: NavigatorItem[] = [
  {
    icon: HomeRounded,
    label: 'Home',
    path: '/',
  },
  {
    icon: SearchRounded,
    label: 'Search',
    path: '/search',
  },
]
