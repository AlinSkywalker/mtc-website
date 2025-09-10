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
      const { username, password } = data
      // const response = await apiClient.post('/api/profile', data)
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
      name: 'sportCategory',
      label: 'Разряды/Категории',
      component: <MemberSportCategoryTab memberId={currentMemberId} readOnly={true} />,
    },
    {
      name: 'ascents',
      label: 'Восхождения',
      component: <MemberAscentTab memberId={currentMemberId} readOnly={true} />,
    },
    {
      name: 'exam',
      label: 'Зачеты',
      component: <MemberExamTab memberId={currentMemberId} readOnly={true} />,
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
      <Grid
        container
        justifyContent='center'
        alignItems='center'
      // sx={{ width: '100%', height: '100%' }}
      >
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
                    name='name_city'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Город' fullWidth disabled />
                    )}
                  />
                </Grid>
                <Grid>
                  <Controller
                    name='tel_1'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} variant='outlined' label='Телефон основной' fullWidth />
                    )}
                  />
                </Grid>
                <Grid>
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
