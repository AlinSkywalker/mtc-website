import React from 'react'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { RegionDictionaryTab } from './dictionaryTabs/RegionDictionaryTab'
import { CityDictionaryTab } from './dictionaryTabs/CityDictionaryTab'
import { DistrictDictionaryTab } from './dictionaryTabs/DistrictDictionaryTab'
import { LaboratoryDictionaryTab } from './dictionaryTabs/LaboratoryDictionaryTab'
import { ContractorDictionaryTab } from './dictionaryTabs/ContractorDictionaryTab'
import { BaseDictionaryTab } from './dictionaryTabs/BaseDictionaryTab'
import { SummitDictionaryTab } from './dictionaryTabs/SummitDictionaryTab'
import { RouteDictionaryTab } from './dictionaryTabs/RouteDictionaryTab'

export const DictionaryPage = () => {
  const [value, setValue] = React.useState(0)
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
