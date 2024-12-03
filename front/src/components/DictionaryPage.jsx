import React from 'react'
import Container from '@mui/material/Container'
import { useFetchMemberList } from '../queries/member'
import { useNavigate } from 'react-router-dom'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { RegionDictionaryTab } from './RegionDictionaryTab'
import { CityDictionaryTab } from './CityDictionaryTab'
import { DistrictDictionaryTab } from './DistrictDictionaryTab'
import { LaboratoryDictionaryTab } from './LaboratoryDictionaryTab'
import { ContractorDictionaryTab } from './ContractorDictionaryTab'
import { BaseDictionaryTab } from './BaseDictionaryTab'
import { SummitDictionaryTab } from './SummitDictionaryTab'
import { RouteDictionaryTab } from './RouteDictionaryTab'

export const DictionaryPage = () => {
  const { isLoading, data } = useFetchMemberList()
  const navigate = useNavigate()

  const [value, setValue] = React.useState(0)
  console.log('value', value)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const dictionaryTabs = [
    {
      name: 'region',
      label: 'Регионы',
      component: <RegionDictionaryTab />,
    },
    {
      name: 'district',
      label: 'Районы',
      component: <DistrictDictionaryTab />,
    },
    {
      name: 'summit',
      label: 'Вершины',
      component: <SummitDictionaryTab />,
    },
    {
      name: 'route',
      label: 'Маршруты',
      component: <RouteDictionaryTab />,
    },
    {
      name: 'laboratory',
      label: 'Лаборатории',
      component: <LaboratoryDictionaryTab />,
    },
    {
      name: 'contractor',
      label: 'Контрагенты',
      component: <ContractorDictionaryTab />,
    },
    {
      name: 'base',
      label: 'Места базирования',
      component: <BaseDictionaryTab />,
    },
    {
      name: 'city',
      label: 'Города',
      component: <CityDictionaryTab />,
    },
  ]

  if (isLoading) return null
  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' }, overflowX: 'scroll' }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {dictionaryTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index} />
            ))}
          </TabList>
        </Box>
        {dictionaryTabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: '10px 0' }}>
            {value === index && tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Container>
  )
}
