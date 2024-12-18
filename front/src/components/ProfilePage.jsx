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
import { useFetchProfile } from '../queries/profile'

export const ProfilePage = () => {
  const defaultValues = { userName: '', fio: '' }
  const { userInfo } = useContext(AuthContext)
  const { data } = useFetchProfile(userInfo.id)
  console.log('data', data)
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
  } = useForm({ defaultValues })

  useEffect(() => {
    data && reset(data)
  }, [data])

  const isDirty = !!Object.keys(dirtyFields).length

  const handleSaveProfileData = async (data, e) => {
    e.preventDefault()
    try {
      const { username, password } = data
      const response = await apiClient.post('/api/profile', data)
      // Handle successful login
    } catch (error) {
      // Handle login error
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(data ? data : defaultValues)
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
                  name='memb_email'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Email' disabled />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  name='fio'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Фамилия Имя Отчество' />
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
