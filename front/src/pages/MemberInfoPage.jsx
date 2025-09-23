import React from 'react'
import Container from '@mui/material/Container'
import { useFetchMember } from '../queries/member'
import { useLocation } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import Tabs from '@mui/material/Tabs'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { MemberExamTab } from '../components/memberTabs/MemberExamTab'
import { MemberAscentTab } from '../components/memberTabs/MemberAscentTab'
import { MemberEventTab } from '../components/memberTabs/MemberEventTab'
import { MemberSportCategoryTab } from '../components/memberTabs/MemberSportCategoryTab'
import { MemberInfoForm } from '../components/MemberInfoForm'

export const MemberInfoPage = () => {
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const location = useLocation()
  const locationSplitted = location.pathname.split('/')
  const currentId = locationSplitted[locationSplitted.length - 1]
  const { isLoading, data } = useFetchMember(currentId)

  const memberTabs = [
    {
      name: 'sportCategory',
      label: 'Разряды/Категории',
      component: <MemberSportCategoryTab memberId={currentId} />,
    },
    {
      name: 'ascents',
      label: 'Восхождения',
      component: <MemberAscentTab memberId={currentId} />,
    },
    {
      name: 'exam',
      label: 'Зачеты',
      component: <MemberExamTab memberId={currentId} />,
    },
    {
      name: 'event',
      label: 'Мероприятия',
      component: <MemberEventTab memberId={currentId} />,
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
      <MemberInfoForm memberData={data} isLoading={isLoading} />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs onChange={handleChange} variant='scrollable' scrollButtons='auto' value={value}>
            {memberTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index} />
            ))}
          </Tabs>
        </Box>
        {memberTabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: '10px 0' }}>
            {value === index && tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Container>
  )
}
