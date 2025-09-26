import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import apiClient from '../api/api'
import { useFetchEvent } from '../queries/event'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import { AsynchronousAutocomplete } from './AsynchronousAutocomplete'
import { CircularProgress, Typography } from '@mui/material'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useIsMobile } from '../hooks/useIsMobile'

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
  const isMobile = useIsMobile()
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
      reset(data)
    } catch (error) {
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(data)
  }

  const fetchOBMembers = () => apiClient.get(`/api/memberList?possibleRole=ob`)
  const fetchSTMembers = () => apiClient.get(`/api/memberList?possibleRole=st`)
  const fetchDoctorMembers = () => apiClient.get(`/api/memberList`)

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
          <Grid size={isMobile ? 12 : 3}>
            <Controller
              name='st'
              control={control}
              render={({ field }) => (
                <AsynchronousAutocomplete
                  label='СТ'
                  request={fetchSTMembers}
                  dataNameField='fio'
                  field={field}
                  errors={errors}
                  disabled
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 3}>
            <Controller
              name='ob'
              control={control}
              render={({ field }) => (
                <AsynchronousAutocomplete
                  label='ОБ'
                  request={fetchOBMembers}
                  dataNameField='fio'
                  field={field}
                  errors={errors}
                  disabled
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 3}>
            <Controller
              name='doctor'
              control={control}
              render={({ field }) => (
                <AsynchronousAutocomplete
                  label='Врач'
                  request={fetchDoctorMembers}
                  dataNameField='fio'
                  field={field}
                  errors={errors}
                  disabled
                />
              )}
            />
          </Grid>
          <Grid size={isMobile ? 12 : 3}>
            <Controller
              name='raion_name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label='Район проведения'
                  fullWidth
                  disabled
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
