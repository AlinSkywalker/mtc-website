import React, { useContext, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { Link } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
import apiClient from '../api/api'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Typography } from '@mui/material'

const validationSchema = Yup.object({
  username: Yup.string().required('Поле обязательно для заполнения'),
  password: Yup.string().required('Поле обязательно для заполнения'),
})

const defaultValues = {
  username: '',
  password: '',
}
export const LoginPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  const { setIsAuthenticated, setUserInfo } = useContext(AuthContext)

  const [serverError, setServerError] = useState(false)
  const handleLogin = (data, e) => {
    e.preventDefault()

    const { username, password } = data
    // navigate('/profile')
    return apiClient
      .post('/api/login', { username, password })
      .then((response) => {
        // Handle successful login
        const { token, user_role, user_id, user_member_id } = response.data
        setIsAuthenticated(true)
        setUserInfo({ id: user_id, role: user_role, memberId: user_member_id })
        localStorage.setItem('token', token)
      })
      .catch((error) => {
        // Handle login error
        console.error(error)
        setServerError(true)
      })
  }

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
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <form onSubmit={handleSubmit(handleLogin)}>
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
                <Grid>
                  <Button variant='contained' type='submit'>
                    Войти
                  </Button>
                </Grid>
                {serverError && (
                  <Grid>
                    <Typography sx={{ color: 'red' }}>Неправильный логин или пароль</Typography>
                  </Grid>
                )}
                <Grid>
                  <Link to='/register'>Зарегистрироваться</Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  )
}
