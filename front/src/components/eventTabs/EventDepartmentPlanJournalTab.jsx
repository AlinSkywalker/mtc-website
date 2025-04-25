import React, { useEffect, useMemo, useState } from 'react'
import { useFetchEventDepartmentWithPlanAtDateList } from '../../queries/event'
import Grid from '@mui/material/Grid'
import { getDatesInRange } from '../../utils/getDatesInRange'
import './EventAllDepartmentPlansTableStyle.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Button, Popover } from '@mui/material'
import apiClient from '../../api/api'
import FormControl from '@mui/material/FormControl'
import { formatISO, parse, format } from 'date-fns'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { EventDepartmentPlanJournalCell } from './EventDepartmentPlanJournalCell'

export const EventDepartmentPlanJournalTab = ({ eventId, eventStart, eventFinish }) => {
  // в заголовке те отделения, у которых есть план на дату
  const dates = getDatesInRange(new Date(eventStart), new Date(eventFinish))

  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDateToServer = (date) => {
    return formatISO(date, { representation: 'date' })
  }
  const formatDateTimeToServer = (date) => {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  }
  const selectedDateServerFormat = useMemo(() => formatDateToServer(selectedDate), [selectedDate])

  const { data: departmentData } = useFetchEventDepartmentWithPlanAtDateList(
    eventId,
    formatDateToServer(selectedDate),
  )

  const [journalData, setJournalData] = useState({})

  const fetchJournalData = () => {
    apiClient
      .get(
        `/api/eventList/${eventId}/departments/allDepartmentPlanJournal/${selectedDateServerFormat}`,
      )
      .then((data) => {
        setJournalData(data.data)
      })
  }

  useEffect(() => {
    fetchJournalData()
  }, [selectedDate])

  const [newJournalTime, setNewJournalTime] = useState()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  const renderCell = (department, journalItem, date) => {
    return (
      <EventDepartmentPlanJournalCell
        department={department}
        journalItem={journalItem}
        date={date}
        eventId={eventId}
        fetchJournalData={fetchJournalData}
      />
    )
  }

  const handleAddJournalTime = () => {
    apiClient
      .post(
        `/api/eventList/${eventId}/departments/allDepartmentPlanJournal/${selectedDateServerFormat}/addPlanJournalTime`,
        { dateTime: formatDateTimeToServer(newJournalTime) },
      )
      .then((data) => {
        handleClose()
        setNewJournalTime()
        fetchJournalData()
      })
  }
  if (!journalData || !departmentData) return

  return (
    <Grid container sx={{ width: '100%', overflowX: 'scroll' }}>
      <Grid>
        <Grid item sx={{ width: '100%' }} container flexDirection={'row'} className='depPlanRow'>
          <Grid className={'depPlanCell depPlanDateCell depPlanTitleCell'}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
              <Select
                label=''
                fullWidth
                // onChange={(event) => setSelectedDate(event.target.value)}
                value={format(selectedDate, 'dd.MM')}
              >
                {dates.map((item, index) => (
                  <MenuItem
                    value={format(parse(item.date, 'dd.MM.yyyy', new Date()), 'dd.MM')}
                    key={index}
                    onClick={() => setSelectedDate(parse(item.date, 'dd.MM.yyyy', new Date()))}
                  >
                    {item.date.substring(0, 5)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {departmentData.map((department) => {
            return (
              <Grid
                key={department.id}
                className={'depPlanCell depPlanTitleCell'}
              >{`${department.depart_tip} ${department.depart_name}`}</Grid>
            )
          })}
        </Grid>
        {Object.entries(journalData).map(([key, item]) => {
          return (
            <Grid
              key={key}
              item
              sx={{ width: '100%' }}
              container
              flexDirection={'row'}
              className='depPlanRow'
            >
              <Grid className={'depPlanCell depPlanDateCell depPlanJournalCell'}>
                {key.substring(11)}
              </Grid>
              {departmentData.map((department) => renderCell(department, item, key))}
            </Grid>
          )
        })}
        {departmentData.length !== 0 && (
          <Grid
            key='addNew'
            item
            sx={{ width: '100%' }}
            container
            flexDirection={'row'}
            className='depPlanRowNew'
            alignContent='center'
            justifyContent='center'
          >
            <Button onClick={handleClick}>Добавить время связи</Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Card>
                <CardContent>
                  <DateTimePicker
                    label='Новая дата связи'
                    value={newJournalTime}
                    onChange={(newValue) => setNewJournalTime(newValue)}
                  />
                </CardContent>
                <CardActions>
                  <Button onClick={handleAddJournalTime}>Сохранить</Button>
                </CardActions>
              </Card>
            </Popover>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
