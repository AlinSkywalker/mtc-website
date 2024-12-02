import React, { useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Container from '@mui/material/Container'
import { useNavigate, redirect } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import apiClient from '../api/api'

const LoginPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ username: '', password: '' })

  const navigate = useNavigate()
  const { setIsAuthenticated, setUserInfo } = useContext(AuthContext)
  const handleLogin = (data, e) => {
    console.log('handleLogin', data)
    e.preventDefault()

    const { username, password } = data
    // navigate('/profile')
    apiClient
      .post('/api/login', { username, password })
      .then((response) => {
        // Handle successful login
        console.log(response.data)
        const { token, user_role, user_id } = response.data
        setIsAuthenticated(true)
        setUserInfo({ id: user_id, role: user_role })
        localStorage.setItem('token', token)
      })
      .catch((error) => {
        // Handle login error
        console.error(error)
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
                <Grid item>
                  <Controller
                    name='username'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Email' />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Пароль' />
                    )}
                  />
                </Grid>
                {errors.exampleRequired && (
                  <Grid item>
                    {/* errors will return when field validation fails  */}
                    <span>This field is required</span>
                  </Grid>
                )}
                <Grid item>
                  <Button variant='contained' type='submit'>
                    Войти
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  )
}

export default LoginPage
