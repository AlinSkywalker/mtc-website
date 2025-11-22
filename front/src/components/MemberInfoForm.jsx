import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import apiClient from '../api/api'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import { AsynchronousAutocomplete } from './AsynchronousAutocomplete'
import { CircularProgress } from '@mui/material'
import { sizeClothOptions, sizeShoeOptions } from '../constants'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useIsMobile } from '../hooks/useIsMobile'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { PhoneField } from './formFields/PhoneField'
import { parsePhoneNumber } from 'react-phone-number-input'

const defaultValues = {
  fio: '',
  gender: '',
  date_birth: null,
  memb_city: '',
  tel_1: '',
  tel_2: '',
  memb_email: '',
  size_cloth: '?',
  size_shoe: '?',
  alprazr: '',
  date_razr: null,
  alpzeton: '',
  date_zeton: null,
  alpinstr: '',
  alpinstrnom: '',
  date_instr: null,
  city: { name_city: '', id: 0 },
  ledu: 'WI2',
  skali: '5a',
  emergency_contact: '',
}

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
  memb_email: Yup.string()
    .nullable()
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      {
        message: 'Поле неверного формата',
        excludeEmptyString: true,
      },
    ),
})

export const MemberInfoForm = ({ memberData, isLoading }) => {
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  useEffect(() => {
    memberData && reset(memberData)
  }, [memberData])

  const isDirty = !!Object.keys(dirtyFields).length
  const handleSave = async (data, e) => {
    e.preventDefault()
    try {
      const { date_birth, date_razr, date_zeton, date_instr } = data
      await apiClient.post(`/api/memberList/${data.id}`, {
        ...data,
        date_birth: date_birth ? format(date_birth, 'yyyy-MM-dd') : null,
        date_razr: date_razr ? format(date_razr, 'yyyy-MM-dd') : null,
        date_zeton: date_zeton ? format(date_zeton, 'yyyy-MM-dd') : null,
        date_instr: date_instr ? format(date_instr, 'yyyy-MM-dd') : null,
        tel_1: data.tel_1 ? parsePhoneNumber(data.tel_1)?.number : '',
        tel_2: data.tel_2 ? parsePhoneNumber(data.tel_2)?.number : '',
      })
      reset(undefined, { keepDirtyValues: true })
    } catch (error) {
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(memberData)
  }

  const fetchAllCities = () => apiClient.get(`/api/cityDictionary`)

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
  const isMobile = useIsMobile()

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <Grid
            container
            // justifyContent='center'
            // alignItems='center'
            flexDirection='row'
            spacing={2}
            sx={{ marginBottom: 4 }}
          >
            <Grid size={isMobile ? 12 : 4}>
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
            </Grid>
            <Grid size={isMobile ? 12 : 1}>
              <Controller
                name='gender'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id='ageLabel'>Пол</InputLabel>
                    <Select {...field} label='Пол' fullWidth labelId='ageLabel'>
                      {['М', 'Ж'].map((item, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
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
            </Grid>
            <Grid size={isMobile ? 12 : 1}>
              <Controller
                name='size_shoe'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id='sizeShoeLabel'>Размер обуви</InputLabel>
                    <Select {...field} label='Размер обуви' fullWidth labelId='sizeShoeLabel'>
                      {sizeShoeOptions.map((item, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 1}>
              <Controller
                name='size_cloth'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id='sizeClothLabel'>Размер одежды</InputLabel>
                    <Select {...field} label='Размер одежды' fullWidth labelId='sizeClothLabel'>
                      {sizeClothOptions.map((item, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <AsynchronousAutocomplete
                    label='Город'
                    request={fetchAllCities}
                    dataNameField='name_city'
                    field={field}
                    errors={errors}
                    secondarySourceArray={['count_name', 'okr_name', 'sub_name']}
                  />
                )}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
              {/* <Controller
                name='tel_1'
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant='outlined' label='Телефон основной' fullWidth />
                )}
              /> */}
              <PhoneInput
                control={control}
                rules={{ required: true }}
                name='tel_1'
                label='Телефон основной'
                defaultCountry='RU'
                inputComponent={PhoneField}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
              {/* <Controller
                name='tel_2'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='outlined'
                    label='Телефон экстренного контакта'
                    fullWidth
                  />
                )}
              /> */}
              <PhoneInput
                control={control}
                rules={{ required: true }}
                name='tel_2'
                label='Телефон экстренного контакта'
                defaultCountry='RU'
                inputComponent={PhoneField}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
              <Controller
                name='emergency_contact'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='outlined'
                    label='Имя экстренного контакта'
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
              <Controller
                name='memb_email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='outlined'
                    label='Email'
                    fullWidth
                    error={errors[field.name]}
                    helperText={errors[field.name]?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid
            container
            // justifyContent='center'
            // alignItems='center'
            flexDirection='row'
            spacing={2}
            columns={24}
          >
            <Grid size={isMobile ? 24 : 4}>
              <Controller
                name='alpzeton'
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant='outlined' label='Номер жетона' fullWidth />
                )}
              />
            </Grid>
            <Grid size={isMobile ? 24 : 3}>
              <Controller
                name='date_zeton'
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label='Дата получения жетона'
                    {...field}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              />
            </Grid>
            <Grid size={isMobile ? 24 : 4}>
              <Controller
                name='alpinstrnom'
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant='outlined' label='Номер инструктора' fullWidth />
                )}
              />
            </Grid>
            <Grid size={isMobile ? 24 : 2}>
              <Controller
                name='skali'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id='skaliLabel'>Уровень скалолазания</InputLabel>
                    <Select {...field} label='Уровень скалолазания' fullWidth labelId='skaliLabel'>
                      {[
                        '5a',
                        '5b',
                        '5c',
                        '6a',
                        '6b',
                        '6c',
                        '7a',
                        '7b',
                        '7c',
                        '8a',
                        '8b',
                        '8c',
                        '9a',
                      ].map((item, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={isMobile ? 24 : 2}>
              <Controller
                name='ledu'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id='leduLabel'>Уровень лазания лёд</InputLabel>
                    <Select {...field} label='Уровень лазания лёд' fullWidth labelId='leduLabel'>
                      {['WI2', 'WI3', 'WI4', 'WI5', 'WI6', 'WI7'].map((item, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ marginTop: 4 }}>
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
    </Card>
  )
}
