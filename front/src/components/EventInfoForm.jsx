import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import apiClient from '../api/api'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import { CircularProgress } from '@mui/material'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSnackbar } from 'notistack'
import { SERVER_REQUEST_ERROR } from '../constants'
import { useQueryClient } from '@tanstack/react-query'

const defaultValues = {
  id: 0,
  event_name: '',
  event_base: 0,
  event_start: null,
  event_finish: null,
  event_st: 0,
  event_ob: 0,
  event_desc: '',
  ob_fio: '',
  st_fio: '',
  base_name: '',
  ob: { fio: '', id: 0 },
  st: { fio: '', id: 0 },
  base: { base_name: '', id: 0 },
  raion: { rai_name: '', id: 0 },
  price: '',
  price_sport: '',
  price_tourist: '',
  raion_id_list: [],
  raion_name: '',
}

const validationSchema = Yup.object({
  event_name: Yup.string().required('Поле обязательно для заполнения'),
  event_start: Yup.string().required('Поле обязательно для заполнения'),
  event_finish: Yup.string().required('Поле обязательно для заполнения'),
  ob: Yup.object()
    .test({
      name: 'notSt',
      exclusive: false,
      params: {},
      message: 'ОБ не может совпадать с СТ',
      test: (value, context) => value?.id != context.parent.st?.id,
    })
    .required('Поле обязательно для заполнения'),
  st: Yup.object()
    .test({
      name: 'notOb',
      exclusive: false,
      params: {},
      message: 'ОБ не может совпадать с СТ',
      test: (value, context) => value?.id != context.parent.ob?.id,
    })
    .required('Поле обязательно для заполнения'),
  raion: Yup.object().required('Поле обязательно для заполнения'),
})

export const EventInfoForm = ({ eventData: data, isLoading, readOnly }) => {
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const { enqueueSnackbar } = useSnackbar()
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  useEffect(() => {
    data && reset(data)
  }, [data])

  const isDirty = !!Object.keys(dirtyFields).length
  const handleSave = async (data, e) => {
    e.preventDefault()
    try {
      await apiClient.post(`/api/eventList/${data.id}`, {
        ...data,
        event_start: format(data.event_start, 'yyyy-MM-dd'),
        event_finish: format(data.event_finish, 'yyyy-MM-dd'),
      })
      queryClient.invalidateQueries({ queryKey: ['event', data.id] })
    } catch (error) {
      console.error(error)
      enqueueSnackbar(SERVER_REQUEST_ERROR, {
        variant: 'error',
        autoHideDuration: 5000,
      })
    }
  }
  const handleReset = () => {
    reset(data)
  }

  if (isLoading) {
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )
  }
  return (
    <CardContent>
      <form onSubmit={handleSubmit(handleSave)}>
        <Grid
          container
          // justifyContent='center'
          // alignItems='center'
          flexDirection='row'
          spacing={2}
        >
          <Grid size={isMobile ? 12 : 4}>
            <Controller
              name='event_name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Название'
                  fullWidth
                  error={errors[field.name]}
                  helperText={errors[field.name]?.message}
                  disabled={readOnly}
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 4}>
            <Controller
              name='event_desc'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Описание'
                  fullWidth
                  disabled={readOnly}
                  multiline
                  maxRows={4}
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 2}>
            <Controller
              name='event_start'
              control={control}
              render={({ field }) => (
                <DatePicker
                  disabled={readOnly}
                  label='Дата начала'
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: errors[field.name],
                      helperText: errors[field.name]?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 2}>
            <Controller
              name='event_finish'
              control={control}
              render={({ field }) => (
                <DatePicker
                  disabled={readOnly}
                  label='Дата окончания'
                  {...field}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: errors[field.name],
                      helperText: errors[field.name]?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 2}>
            <Controller
              name='price'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Инструкторский сбор'
                  fullWidth
                  error={errors[field.name]}
                  helperText={errors[field.name]?.message}
                  type='number'
                  disabled={readOnly}
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 2}>
            <Controller
              name='price_sport'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Цена для спортсменов'
                  fullWidth
                  error={errors[field.name]}
                  helperText={errors[field.name]?.message}
                  type='number'
                  disabled={readOnly}
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 2}>
            <Controller
              name='price_tourist'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Цена для туристов'
                  fullWidth
                  error={errors[field.name]}
                  helperText={errors[field.name]?.message}
                  type='number'
                  disabled={readOnly}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container sx={{ marginTop: 2 }}>
          <Grid>
            <Button variant='text' type='button' disabled={!isDirty} onClick={handleReset}>
              Отменить
            </Button>
          </Grid>
          <Grid>
            <Button variant='contained' type='submit' disabled={!isDirty}>
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}
