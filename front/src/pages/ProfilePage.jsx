import React, { useContext, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { AuthContext } from '../components/AuthContext'
import apiClient from '../api/api'
import { useFetchProfile } from '../queries/profile'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { sizeClothOptions, sizeShoeOptions } from '../constants'
import { MemberEventTab } from '../components/memberTabs/MemberEventTab'
import { MemberSportCategoryTab } from '../components/memberTabs/MemberSportCategoryTab'
import { MemberAscentTab } from '../components/memberTabs/MemberAscentTab'
import { MemberExamTab } from '../components/memberTabs/MemberExamTab'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import Tabs from '@mui/material/Tabs'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { format } from 'date-fns'
import { AsynchronousAutocomplete } from '../components/AsynchronousAutocomplete'
import { MemberLabaAscentTab } from '../components/memberTabs/MemberLabaAscentTab'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { PhoneField } from '../components/formFields/PhoneField'
import { parsePhoneNumber } from 'react-phone-number-input'

export const ProfilePage = () => {
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
  }
  const { userInfo } = useContext(AuthContext)
  const { data } = useFetchProfile(userInfo.id)
  const fetchAllCities = () => apiClient.get(`/api/cityDictionary`)
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
      const { date_birth, city } = data

      const response = await apiClient.post('/api/profile', {
        ...data,
        date_birth: date_birth ? format(date_birth, 'yyyy-MM-dd') : null,
        memb_city: city.id,
        tel_1: parsePhoneNumber(data.tel_1)?.number,
        tel_2: parsePhoneNumber(data.tel_2)?.number,
      })
      // Handle successful login
    } catch (error) {
      // Handle login error
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(data ? data : defaultValues)
  }
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const basePath = `/profile`
  const currentMemberId = data?.id || ''
  const tabs = [
    {
      name: 'ascents',
      label: 'Восхождения',
      component: <MemberAscentTab memberId={currentMemberId} />,
    },
    {
      name: 'labaAscents',
      label: 'Тренировки',
      component: <MemberLabaAscentTab memberId={currentMemberId} />,
    },
    {
      name: 'exam',
      label: 'Зачеты',
      component: <MemberExamTab memberId={currentMemberId} />,
    },
    {
      name: 'sportCategory',
      label: 'Разряды/Категории',
      component: <MemberSportCategoryTab memberId={currentMemberId} />,
    },
    {
      name: 'event',
      label: 'Мероприятия',
      component: <MemberEventTab memberId={currentMemberId} />,
    },
  ]
  const currentTab = tabs.findIndex(
    (tab) =>
      `${basePath}${tab.path}` === location.pathname ||
      (tab.path !== '/' && location.pathname.startsWith(`${basePath}${tab.path}`)),
  )

  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Grid container justifyContent='center' alignItems='center'>
        <Card sx={{ width: 400 }}>
          <CardContent>
            <form onSubmit={handleSubmit(handleSaveProfileData)}>
              <Grid
                container
                justifyContent='center'
                // alignItems='center'
                flexDirection='column'
                spacing={2}
              >
                <Grid>
                  <Controller
                    name='memb_email'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Email' disabled fullWidth />
                    )}
                  />
                </Grid>
                <Grid>
                  <Controller
                    name='fio'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant='outlined'
                        label='Фамилия Имя Отчество'
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid>
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
                <Grid>
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
                <Grid>
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
                <Grid>
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
                <Grid>
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
                <Grid>
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
                <Grid>
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
                <Grid>
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
                <Grid container>
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
            </form>
          </CardContent>
        </Card>
      </Grid>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs onChange={handleChange} variant='scrollable' scrollButtons='auto' value={value}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index} />
            ))}
          </Tabs>
        </Box>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: '10px 0' }}>
            {value === index && tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Container>
  )
}
