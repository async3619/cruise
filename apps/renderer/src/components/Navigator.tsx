import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Box, IconButton, Stack, Tooltip } from '@mui/material'

import { NAVIGATOR_ITEMS } from '@constants/navigator'

import * as Styled from './Navigator.styled'

interface NavigatorProps {}

function Navigator({}: NavigatorProps) {
  const location = useLocation()

  return (
    <Styled.Root>
      <Stack spacing={1}>
        {NAVIGATOR_ITEMS.map(({ path, label, icon: Icon }) => (
          <Box
            key={path}
            display="flex"
            justifyContent="center"
          >
            <Tooltip
              placement="right"
              title={label}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -8],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton
                draggable="false"
                component={Link}
                to={path}
              >
                <Box
                  component={Icon}
                  color="inherit"
                  sx={{
                    color: location.pathname === path ? 'text.primary' : 'text.disabled',
                    transition: theme =>
                      theme.transitions.create(['color'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.shorter,
                      }),
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Stack>
    </Styled.Root>
  )
}

export default Navigator
