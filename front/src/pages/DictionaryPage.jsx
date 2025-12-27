import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import { RegionDictionaryTab } from '../components/dictionaryTabs/RegionDictionaryTab'
import { CityDictionaryTab } from '../components/dictionaryTabs/CityDictionaryTab'
import { DistrictDictionaryTab } from '../components/dictionaryTabs/DistrictDictionaryTab'
import { LaboratoryDictionaryTab } from '../components/dictionaryTabs/LaboratoryDictionaryTab'
import { ContractorDictionaryTab } from '../components/dictionaryTabs/ContractorDictionaryTab'
import { BaseDictionaryTab } from '../components/dictionaryTabs/BaseDictionaryTab'
import { SummitDictionaryTab } from '../components/dictionaryTabs/SummitDictionaryTab'
import { RouteDictionaryTab } from '../components/dictionaryTabs/RouteDictionaryTab'
import { useNavigate, useLocation } from 'react-router-dom'
import { EquipmentTemplateTab } from '../components/dictionaryTabs/EquipmentTemplateTab'

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
    name: 'equipmentTemplate',
    label: 'Шаблоны снаряжения',
    component: <EquipmentTemplateTab />,
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

export const DictionaryPage = () => {
  const navigate = useNavigate()

  const location = useLocation()
  const locationSplitted = location.pathname.split('/')
  const currentDictionary = locationSplitted[locationSplitted.length - 1]

  const [value, setValue] = React.useState(
    currentDictionary !== 'dictionary'
      ? dictionaryTabs.findIndex((item) => item.name == currentDictionary)
      : 0,
  )
  useEffect(() => {
    if (currentDictionary == 'dictionary') setValue(0)
  }, [currentDictionary])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    navigate(`/crm/dictionary/${dictionaryTabs[newValue].name}`)
  }

  return (
    <Container
      maxWidth={false}
      sx={{ height: 'calc(100vh - 70px)', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
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
