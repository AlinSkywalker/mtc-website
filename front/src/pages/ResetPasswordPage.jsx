import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { Link, useSearchParams } from 'react-router-dom'
import apiClient from '../api/api'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Typography } from '@mui/material'
import MtcImage from '../assets/mtc_black.png'
import { SetNewPasswordForm } from '../components/SetNewPasswordForm'

const validationSchema = Yup.object({
  username: Yup.string().required('Поле обязательно для заполнения'),
})

const defaultValues = {
  username: '',
}
export const ResetPasswordPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  const [serverResponse, setServerResponse] = useState('')

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const isSetPasswordForm = !!token
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    if (token) {
      apiClient
        .post('/api/verify-token', { token })
        .then((response) => {
          if (response) {
            setIsValidToken(true)
          }
        })
        .catch((error) => {
          setIsValidToken(false)
        })
    }
  }, [isSetPasswordForm])

  const handleResetPassword = (data, e) => {
    e.preventDefault()
    const { username } = data
    // navigate('/profile')
    return apiClient
      .post('/api/reset-password', { username })
      .then((response) => {
        if (response) {
          setServerResponse('Ссылка для восстановления пароля отправлена на указанный e-mail')
        }
      })
      .catch((error) => {
        setServerResponse(error)
      })
  }

  const resetForm = (
    <form onSubmit={handleSubmit(handleResetPassword)}>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        spacing={2}
      >
        <Controller
          name='username'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              label='Email'
              error={errors[field.name]}
              helperText={errors[field.name]?.message}
              fullWidth
            />
          )}
        />
        <Grid>
          <Button variant='contained' type='submit'>
            Восстановить пароль
          </Button>
        </Grid>
        {serverResponse && (
          <Grid>
            <Typography>{serverResponse}</Typography>
          </Grid>
        )}
      </Grid>
    </form>
  )
  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: '100%' }}
      >
        <Card sx={{ minWidth: 400 }}>
          <CardContent>
            <Grid container sx={{ mb: 2 }} direction='column' alignItems='center'>
              <img src={MtcImage} alt='ЦАП' height='65px' width='75px' />
              <Typography variant='h6' sx={{ mt: 2 }}>
                Восстановление пароля
              </Typography>
            </Grid>
            {token && isValidToken && <SetNewPasswordForm />}
            {token && !isValidToken && (
              <Grid container alignItems={'center'} justifyContent='center'>
                <Typography sx={{ mt: 2 }}>Ссылка недействительна</Typography>
              </Grid>
            )}
            {!token && resetForm}
            <Grid container alignItems={'center'} justifyContent='center' sx={{ mt: 2 }}>
              <Link to='/login'>Вернуться назад</Link>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  )
}
