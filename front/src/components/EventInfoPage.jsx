import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Container from '@mui/material/Container'
import apiClient from '../api/api'
import { useFetchEvent } from '../queries/event'
import { useFetchMemberList } from '../queries/member'
import { useHistory, useLocation } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useFetchBaseDictionaryList } from '../queries/dictionary'
import formatISO from 'date-fns/parseISO'
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

const defaultValues = {
  id: 0,
  event_name: '',
  event_base: 0,
  event_start: null,
  event_finish: null,
  event_st: 0,
  event_ob: 0,
  event_desc: '',
  created_date: '',
  updated_date: '',
  ob_fio: '',
  st_fio: '',
  base_name: '',
  ob: { fio: '', id: 0 },
  st: { fio: '', id: 0 },
  base: { base_name: '', id: 0 },
}

export const EventInfoPage = () => {
  const [value, setValue] = React.useState(0)
  // console.log('value', value)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const location = useLocation()
  const locationSplitted = location.pathname.split('/')
  const currentId = locationSplitted[locationSplitted.length - 1]
  // console.log(location)
  const { isLoading, data } = useFetchEvent(currentId)
  // console.log(data)
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
  const handleSave = async (data, e) => {
    console.log('handleLogin', data)
    e.preventDefault()
    try {
      const response = await apiClient.post(`/api/event/${data.id}`, {
        ...data,
        event_start: formatISO(data.event_start),
        event_finish: formatISO(data.event_finish),
      })

      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const handleReset = () => {
    reset(data)
  }

  const fetchAllMembers = useFetchMemberList()
  const fetchAllBase = useFetchBaseDictionaryList()

  const eventTabs = [
    {
      name: 'members',
      label: 'Участники',
      component: <EventMembersTab eventId={currentId} />,
    },
    {
      name: 'department',
      label: 'Отделения',
      component: <EventDepartmentTab eventId={currentId} />,
    },
    {
      name: 'smena',
      label: 'Смены',
      component: <EventSmenaTab eventId={currentId} />,
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
            >
              <Grid item size={4}>
                <Controller
                  name='event_name'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Название' fullWidth />
                  )}
                />
              </Grid>
              <Grid item size={4}>
                <Controller
                  name='event_desc'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant='outlined' label='Описание' fullWidth />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='event_start'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Дата начала'
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={2}>
                <Controller
                  name='event_finish'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label='Дата окончания'
                      {...field}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid item size={3}>
                <Controller
                  name='ob'
                  control={control}
                  render={({ field }) => (
                    <AsynchronousAutocomplete
                      label='ОБ'
                      request={fetchAllMembers}
                      dataNameField='fio'
                      field={field}
                    />
                  )}
                />
              </Grid>
              <Grid item size={3}>
                <Controller
                  name='st'
                  control={control}
                  render={({ field }) => (
                    <AsynchronousAutocomplete
                      label='СТ'
                      request={fetchAllMembers}
                      dataNameField='fio'
                      field={field}
                    />
                  )}
                />
              </Grid>
              <Grid item size={3}>
                <Controller
                  name='base'
                  control={control}
                  render={({ field }) => (
                    <AsynchronousAutocomplete
                      label='База'
                      request={fetchAllBase}
                      dataNameField='base_name'
                      field={field}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container>
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
            {eventTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index} />
            ))}
          </TabList>
        </Box>
        {eventTabs.map((tab, index) => (
          <TabPanel key={index} value={index} sx={{ p: '10px 0' }}>
            {value === index && tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Container>
  )
}
