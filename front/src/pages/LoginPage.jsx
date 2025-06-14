import React, { useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useNavigate, redirect } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
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
    e.preventDefault()

    const { username, password } = data
    // navigate('/profile')
    apiClient
      .post('/api/login', { username, password })
      .then((response) => {
        // Handle successful login
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
                <Grid>
                  <Controller
                    name='username'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Email' />
                    )}
                  />
                </Grid>
                <Grid>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Пароль' type='password' />
                    )}
                  />
                </Grid>
                {errors.exampleRequired && (
                  <Grid>
                    {/* errors will return when field validation fails  */}
                    <span>This field is required</span>
                  </Grid>
                )}
                <Grid>
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
