import React, { useContext } from 'react'
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
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
import { useGetProfileTabs } from '../hooks/useGetProfileTabs'
import { ProfileForm } from '../components/forms/ProfileForm'

export const ProfilePage = () => {
  const queryClient = useQueryClient()
  const { userInfo } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()
  const { data } = useFetchProfile(userInfo.id)
  const fetchAllCities = () => apiClient.get(`/api/cityDictionary`)

  const handleSaveProfileData = async (data, e) => {
    e.preventDefault()
    try {
      const { date_birth, city, member_photo, photo, ...rest } = data
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
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' }, overflowY: 'scroll' }}
    >
      <Grid container justifyContent='center' alignItems='center'>
        <Card sx={{ width: 400 }}>
          <CardContent>
            <ProfileForm
              handleSaveProfileData={handleSaveProfileData}
              fetchAllCities={fetchAllCities}
              currentMemberId={currentMemberId}
              currentUserId={userInfo.id}
              data={data}
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
