import React, { useContext, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useNavigate, redirect, Link } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
import apiClient from '../api/api'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography } from '@mui/material'
import * as Yup from 'yup'
import { format } from 'date-fns'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

const validationSchema = Yup.object({
  email: Yup.string().required('Поле обязательно для заполнения'),
  fio: Yup.string().required('Поле обязательно для заполнения'),
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
  date_birth: Yup.string().required('Поле обязательно для заполнения'),
})

const defaultValues = {
  email: '',
  fio: '',
  date_birth: null,
  password: '',
  password_repeat: '',
  gender: 'М',
}

export const RegistrationPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  const [serverError, setServerError] = useState(false)
  const { setIsAuthenticated, setUserInfo } = useContext(AuthContext)
  const handleLogin = (data, e) => {
    e.preventDefault()

    apiClient
      .post('/api/register', { ...data, date_birth: format(data.date_birth, 'yyyy-MM-dd') })
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
        <Card sx={{ minWidth: 475 }}>
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
                  name='email'
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
                  name='fio'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant='outlined'
                      label='ФИО'
                      fullWidth
                      error={errors[field.name]}
                      helperText={errors[field.name]?.message}
                    />
                  )}
                />
                <Controller
                  name='date_birth'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Дата рождения'
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id='genderLabel'>Пол</InputLabel>
                      <Select {...field} label='Пол' fullWidth labelId='genderLabel'>
                        {['М', 'Ж'].map((item, index) => (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                    Зарегистрироваться
                  </Button>
                </Grid>
                {serverError && (
                  <Grid>
                    <Typography sx={{ color: 'red' }}>Произошла ошибка при регистрации</Typography>
                  </Grid>
                )}
                <Grid>
                  <Link to='/login'>Войти в систему</Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  )
}
