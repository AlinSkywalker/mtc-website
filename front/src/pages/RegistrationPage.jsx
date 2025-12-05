import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { AuthContext } from '../components/AuthContext'
import apiClient from '../api/api'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography } from '@mui/material'
import * as Yup from 'yup'
import { format } from 'date-fns'
import { RegistrationForm } from './RegistrationForm'
import MtcImage from '../assets/mtc_black.png'

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
  personal_data_consent: Yup.boolean(),
})

const defaultValues = {
  email: '',
  fio: '',
  date_birth: null,
  password: '',
  password_repeat: '',
  gender: 'М',
  personal_data_consent: false,
}

export const RegistrationPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  const [serverError, setServerError] = useState('')
  const { setIsAuthenticated, setUserInfo } = useContext(AuthContext)

  const [consentValue, setConsentValue] = useState(false)

  const handleChangeConsentValue = () => {
    setConsentValue((prevValue) => !prevValue)
  }

  const handleLogin = (data, e) => {
    e.preventDefault()

    apiClient
      .post('/api/register', { ...data, date_birth: format(data.date_birth, 'yyyy-MM-dd') })
      .then((response) => {
        // Handle successful login
        const { token, user_role, user_id, user_member_id } = response.data
        setIsAuthenticated(true)
        setUserInfo({ id: user_id, role: user_role, memberId: user_member_id })
        localStorage.setItem('token', token)
      })
      .catch((error) => {
        // Handle login error
        console.error(error.response.data.message)
        setServerError(error.response.data.message)
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
        <Card sx={{ minWidth: 400 }}>
          <CardContent>
            <Grid container sx={{ mb: 2 }} direction='column' alignItems='center'>
              <img src={MtcImage} alt='ЦАП' height='65px' width='75px' />
              <Typography variant='h6' sx={{ mt: 2 }}>
                Регистрация
              </Typography>
            </Grid>
            <RegistrationForm
              handleLogin={handleLogin}
              handleSubmit={handleSubmit}
              control={control}
              errors={errors}
              consentValue={consentValue}
              handleChangeConsentValue={handleChangeConsentValue}
              serverError={serverError}
            />
          </CardContent>
        </Card>
      </Grid>
    </Container>
  )
}
