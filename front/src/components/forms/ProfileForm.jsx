import React, { useContext, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { sizeClothOptions, sizeShoeOptions } from '../../constants'
import { AsynchronousAutocomplete } from '../AsynchronousAutocomplete'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { PhoneField } from '../formFields/PhoneField'
import { ProfileFormImage } from './ProfileFormImage'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useIsMobile } from '../../hooks/useIsMobile'
import { Card, CardContent, Typography } from '@mui/material'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
  date_birth: Yup.string().required('Поле обязательно для заполнения'),
  tel_1: Yup.string().required('Поле обязательно для заполнения'),
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

const defaultValues = {
  userName: '',
  fio: '',
  gender: '',
  memb_email: '',
  date_birth: null,
  memb_city: '',
  tel_1: '',
  tel_2: '',
  size_cloth: '?',
  size_shoe: '?',
  name_city: '',
  city: { name_city: '', id: 0 },
  emergency_contact: '',
  about_me: '',
}

export const ProfileForm = ({
  handleSaveProfileData,
  fetchAllCities,
  data,
  currentMemberId,
  currentUserId,
}) => {
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

  const handleReset = () => {
    reset(data ? data : defaultValues)
  }

  const photo = data?.member_photo

  const isMobile = useIsMobile()
  const {
    userInfo: { isClubMember },
  } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/crm/membership')
  }

  const lastPaymentDate = data?.last_payment_date ? new Date(data?.last_payment_date) : null
  const currentDate = new Date()

  const isActiveMembersip =
    lastPaymentDate?.getFullYear() === currentDate.getFullYear() ||
    (lastPaymentDate?.getFullYear() === currentDate.getFullYear() - 1 &&
      lastPaymentDate?.getMonth() > 10)

  let activeUntilYear = ''
  if (
    lastPaymentDate?.getFullYear() === currentDate.getFullYear() &&
    currentDate?.getMonth() > 10 &&
    lastPaymentDate?.getMonth() > 10
  ) {
    String(currentDate.getFullYear() + 1)
  } else if (lastPaymentDate?.getFullYear() === currentDate.getFullYear()) {
    activeUntilYear = String(currentDate.getFullYear())
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <form onSubmit={handleSubmit(handleSaveProfileData)}>
          <Grid container wrap={isMobile ? 'wrap' : 'nowrap'}>
            <Grid
              sx={{
                width: isMobile ? '100%' : 200,
                flexShrink: 0,
                marginRight: 1,
                marginBottom: 1,
                textAlign: 'center',
              }}
            >
              <ProfileFormImage
                photo={photo}
                currentMemberId={currentMemberId}
                currentUserId={currentUserId}
              />
              {isActiveMembersip && isClubMember && (
                <Typography>Действующий до 31.12.{activeUntilYear}</Typography>
              )}
              <Button variant='contained' onClick={handleClick}>
                {isClubMember ? 'Продлить членство' : 'Вступить в клуб'}
              </Button>
            </Grid>
            <Grid>
              <Grid container flexDirection='row' spacing={2} sx={{ marginBottom: 4 }}>
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
                        disabled
                      />
                    )}
                  />
                </Grid>
                <Grid size={isMobile ? 12 : 3}>
                  <Controller
                    name='about_me'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant='outlined'
                        label='О себе'
                        fullWidth
                        multiline
                        maxRows={isMobile ? 3 : 1}
                      />
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
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
