import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export const PasswordField = ({ field, errors, label }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event) => event.preventDefault()

  return (
    <TextField
      {...field}
      variant='outlined'
      label={label}
      type={showPassword ? 'text' : 'password'}
      error={errors[field.name]}
      helperText={errors[field.name]?.message}
      fullWidth
      slotProps={{
        input: {
          endAdornment: (
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        },
      }}
    />
  )
}
