import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useSearchParams } from 'react-router-dom'
import apiClient from '../api/api'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Typography } from '@mui/material'

const validationSchema = Yup.object({
  password: Yup.string().required('Поле обязательно для заполнения'),
  password_repeat: Yup.string()
    .required('Поле обязательно для заполнения')
    .test({
      name: 'notSt',
      exclusive: false,
      params: {},
      message: 'Пароли не совпадают',
      test: (value, context) => value == context.parent.password,
    }),
})

const defaultValues = {
  password: '',
  password_repeat: '',
}

export const SetNewPasswordForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [serverResponse, setServerResponse] = useState('')
  const [isSuccessfulChanges, setIsSuccessfulChanges] = useState(false)
  const handleResetPassword = (data, e) => {
    e.preventDefault()

    const { password } = data

    return apiClient
      .post('/api/reset-password', { password, token })
      .then((response) => {
        setServerResponse(response)
        if (response) {
          setIsSuccessfulChanges(true)
        }
        // console.log('serverResponse then', response)
      })
      .catch((error) => {
        // Handle login error
        console.error(error)
        // console.log('serverResponse catch', error)
        setServerResponse(error)
      })
  }

  return (
    <form onSubmit={handleSubmit(handleResetPassword)}>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        spacing={2}
      >
        {!isSuccessfulChanges && (
          <>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Пароль'
                  type='password'
                  error={errors[field.name]}
                  helperText={errors[field.name]?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name='password_repeat'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Повторите пароль'
                  type='password'
                  error={errors[field.name]}
                  helperText={errors[field.name]?.message}
                  fullWidth
                />
              )}
            />
            <Grid>
              <Button variant='contained' type='submit'>
                Сменить пароль
              </Button>
            </Grid>
            {serverResponse && (
              <Grid>
                <Typography sx={{ color: 'red' }}>{serverResponse}</Typography>
              </Grid>
            )}
          </>
        )}
        {isSuccessfulChanges && (
          <Grid>
            <Typography>Пароль успешно изменен</Typography>
          </Grid>
        )}
      </Grid>
    </form>
  )
}
