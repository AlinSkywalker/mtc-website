import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { AuthContext } from '../components/AuthContext'
import apiClient from '../api/api'
import { useFetchProfile } from '../queries/profile'
import { SERVER_REQUEST_ERROR } from '../constants'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import Tabs from '@mui/material/Tabs'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { format } from 'date-fns'
import { parsePhoneNumber } from 'react-phone-number-input'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
import { useGetProfileTabs } from '../hooks/useGetProfileTabs'
import { ProfileForm } from '../components/forms/ProfileForm'

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
export const ProfilePage = () => {
  const queryClient = useQueryClient()
  const { userInfo } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()
  const { data } = useFetchProfile(userInfo.id)
  const fetchAllCities = () => apiClient.get(`/api/cityDictionary`)
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

  const handleSaveProfileData = async (data, e) => {
    e.preventDefault()
    try {
      const { date_birth, city, member_photo, ...rest } = data
      const postData = {
        ...rest,
        date_birth: date_birth ? format(date_birth, 'yyyy-MM-dd') : null,
        memb_city: city.id,
        tel_1: data.tel_1 ? parsePhoneNumber(data.tel_1)?.number : '',
        tel_2: data.tel_2 ? parsePhoneNumber(data.tel_2)?.number : '',
      }
      await apiClient.post('/api/profile', postData)
      queryClient.invalidateQueries({ queryKey: ['profile', userInfo.id] })
    } catch (error) {
      // Handle login error
      console.error(error)
      enqueueSnackbar(SERVER_REQUEST_ERROR, {
        variant: 'error',
        autoHideDuration: 5000,
      })
    }
  }
  const handleReset = () => {
    reset(data ? data : defaultValues)
  }
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const basePath = `/crm/profile`
  const currentMemberId = data?.id || ''
  const tabs = useGetProfileTabs(currentMemberId)
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
            <ProfileForm
              handleSaveProfileData={handleSaveProfileData}
              handleSubmit={handleSubmit}
              control={control}
              errors={errors}
              isDirty={isDirty}
              handleReset={handleReset}
              fetchAllCities={fetchAllCities}
              photo={data?.member_photo}
              currentMemberId={currentMemberId}
              currentUserId={userInfo.id}
            />
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
