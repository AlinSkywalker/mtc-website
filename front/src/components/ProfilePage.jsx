import React, { useContext, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Container from '@mui/material/Container'
import { AuthContext } from './AuthContext'
import apiClient from '../api/api'

export const ProfilePage = () => {
  const defaultValues = { userName: '', lastName: '', firstName: '', middleName: '' }
  const { userInfo } = useContext(AuthContext)
  useEffect(() => {
    userInfo.id && apiClient.get(`/api/profile/${userInfo.id}`).then()
  }, [userInfo.id])
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
  } = useForm({ defaultValues })

  const isDirty = !!Object.keys(dirtyFields).length
  const handleSaveProfileData = async (data, e) => {
    e.preventDefault()
    try {
      const { username, password } = data
      const response = await apiClient.post('/api/profile', { username, data })
      // Handle successful login
    } catch (error) {
      // Handle login error
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(defaultValues)
  }

  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <form onSubmit={handleSubmit(handleSaveProfileData)}>
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
                    <TextField {...field} variant='outlined' label='Email' disabled />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name='lastName'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Фамилия' />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => <TextField {...field} variant='outlined' label='Имя' />}
                />
              </Grid>
              <Grid item>
                <Controller
                  name='middleName'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Отчество' />
                  )}
                />
              </Grid>
              <Grid container item>
                <Grid item>
                  <Button variant='text' type='button' disabled={!isDirty} onClick={handleReset}>
                    Отменить
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' type='submit'>
                    Сохранить
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}
