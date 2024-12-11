import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Container from '@mui/material/Container'
import apiClient from '../api/api'
import { useFetchMember } from '../queries/member'
import { useHistory, useLocation } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useFetchBaseDictionaryList } from '../queries/dictionary'
import { format } from 'date-fns'
import { AsynchronousAutocomplete } from './AsynchronousAutocomplete'
import { CircularProgress } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { EventMembersTab } from './eventTabs/EventMembersTab'
import { EventSmenaTab } from './eventTabs/EventSmenaTab'
import { EventDepartmentTab } from './eventTabs/EventDepartmentTab'
import { EventContractorTab } from './eventTabs/EventContractorTab'
import { sizeClothOptions, sizeShoeOptions } from '../constants'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

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
}

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberInfoPage = () => {
  const [value, setValue] = React.useState(0)
  // console.log('value', value)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const location = useLocation()
  const locationSplitted = location.pathname.split('/')
  const currentId = locationSplitted[locationSplitted.length - 1]
  // console.log(location)
  const { isLoading, data } = useFetchMember(currentId)
  // console.log(data)
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })
  console.log('errors', errors)
  useEffect(() => {
    data && reset(data)
  }, [data])

  const isDirty = !!Object.keys(dirtyFields).length
  const handleSave = async (data, e) => {
    console.log('handleLogin', data)
    e.preventDefault()
    try {
      const { date_birth, date_razr, date_zeton, date_instr } = data
      const response = await apiClient.post(`/api/memberList/${data.id}`, {
        ...data,
        date_birth: date_birth ? format(date_birth, 'yyyy-MM-dd') : null,
        date_razr: date_razr ? format(date_razr, 'yyyy-MM-dd') : null,
        date_zeton: date_zeton ? format(date_zeton, 'yyyy-MM-dd') : null,
        date_instr: date_instr ? format(date_instr, 'yyyy-MM-dd') : null,
      })
      reset(data)
      // console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(data)
  }

  const fetchAllCities = () => apiClient.get(`/api/cityDictionary`)

  const memberTabs = [
    {
      name: 'ascents',
      label: 'Восхождения',
      component: <EventMembersTab eventId={currentId} />,
    },
    {
      name: 'exam',
      label: 'Зачеты',
      component: <EventDepartmentTab eventId={currentId} />,
    },
  ]

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
    <Container
      maxWidth={false}
      sx={{ minHeight: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
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
              <Grid item size={4}>
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
              <Grid item size={1}>
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
              <Grid item size={2}>
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
              <Grid item size={1}>
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
              <Grid item size={1}>
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
              <Grid item size={2}>
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
                    />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='tel_1'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Телефон основной' fullWidth />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='tel_2'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant='outlined'
                      label='Телефон дополнительный'
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='memb_email'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Email' fullWidth />
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
            >
              <Grid item size={1}>
                <Controller
                  name='alprazr'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id='alprazrLabel'>Разряд</InputLabel>
                      <Select {...field} label='Разряд' fullWidth labelId='alprazrLabel'>
                        {['3', '2', '1', 'КМС', 'МС', 'МСМК', 'ЗМС'].map((item, index) => (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='date_razr'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Дата присвоения разряда'
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='alpzeton'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Номер жетона' fullWidth />
                  )}
                />
              </Grid>
              <Grid item size={2}>
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
              <Grid item size={1}>
                <Controller
                  name='alpinstr'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id='alpinstrLabel'>Категория инструктор</InputLabel>
                      <Select
                        {...field}
                        label='Категория инструктор'
                        fullWidth
                        labelId='alpinstrLabel'
                      >
                        {['3', '2', '1'].map((item, index) => (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='alpinstrnom'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Номер инструктора' fullWidth />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='date_instr'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Дата инструктора'
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: 4 }}>
              <Grid item>
                <Button variant='text' type='button' disabled={!isDirty} onClick={handleReset}>
                  Отменить
                </Button>
              </Grid>
              <Grid item>
                <Button variant='contained' type='submit' disabled={!isDirty}>
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {memberTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index} />
            ))}
          </TabList>
        </Box>
        {/* {memberTabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: '10px 0' }}>
            {value === index && tab.component}
          </TabPanel>
        ))} */}
      </TabContext>
    </Container>
  )
}
