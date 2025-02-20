import React, { useEffect, useState } from 'react'
import {
  useFetchEventAllDepartmentPlanJournalList,
  useFetchEventDepartmentList,
} from '../../queries/event'
import Grid from '@mui/material/Grid2'
import { getDatesInRange } from '../../utils/getDatesInRange'
import './EventAllDepartmentPlansTableStyle.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Button, Popover } from '@mui/material'
import apiClient from '../../api/api'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import EditIcon from '@mui/icons-material/Edit'
import { formatISO, parse, format } from 'date-fns'

export const EventDepartmentPlanJournalTab = ({ eventId, eventStart, eventFinish }) => {
  // пока пусть в заголовке будут все отделения,
  // но потом нужно будет наверно сделать только отделения, у которых выбранная дата входит в даты отделения
  const { data: departmentData } = useFetchEventDepartmentList(eventId)
  const dates = getDatesInRange(new Date(eventStart), new Date(eventFinish))
  // console.log('dates', dates)
  const [selectedDate, setSelectedDate] = useState(new Date())
  // console.log('selectedDate', selectedDate)
  // const { isLoading, data } = useFetchEventAllDepartmentPlanJournalList(
  //   eventId,
  //   formatISO(selectedDate, { representation: 'date' }),
  // )

  const [journalData, setJournalData] = useState({})

  useEffect(() => {
    apiClient
      .get(
        `/api/eventList/${eventId}/departments/allDepartmentPlanJournal/${formatISO(selectedDate, { representation: 'date' })}`,
      )
      .then((data) => {
        setJournalData(data.data)
      })
  }, [selectedDate])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  const [anchorElJournalItem, setAnchorElJournalItem] = React.useState(null)
  const handleClickJournalItem = (event) => {
    setAnchorElJournalItem(event.currentTarget)
  }
  const handleCloseJournalItem = () => {
    setAnchorElJournalItem(null)
  }
  const openJournalItem = Boolean(anchorElJournalItem)

  const renderCell = (department, journalItem, date) => {
    const departmentJournalItem = journalItem[department.id]
    // console.log('departmentJournalItem', departmentJournalItem)
    // let planPlace = ''
    // if (depPlan?.type === 'Занятие') {
    //   planPlace = depPlan.laba_name
    // } else if (depPlan?.type === 'Восхождение') {
    //   planPlace = `${depPlan.rout_name}(${depPlan.rout_comp}) - ${depPlan.mount_name}`
    // }
    if (!departmentJournalItem)
      return (
        <Grid key={department.id} className={'depPlanCell depPlanCell-inner'}>
          <IconButton color='primary' onClick={handleClickJournalItem}>
            <EditIcon />
          </IconButton>
        </Grid>
      )
    return (
      <Grid key={department.id} className={'depPlanCell depPlanCell-inner'}>
        {/* <Grid item sx={{ fontWeight: 'bold' }}>
          {depPlan?.type}
        </Grid> */}
        <Grid item sx={{ textAlign: 'center' }}>
          {departmentJournalItem.direction}
          {departmentJournalItem.place_fact}
          {departmentJournalItem.place_plan}
          {departmentJournalItem.plan}
        </Grid>
        <IconButton color='primary' onClick={handleClickJournalItem}>
          <EditIcon />
        </IconButton>
        <Popover
          open={openJournalItem}
          anchorEl={anchorElJournalItem}
          onClose={handleCloseJournalItem}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          поля для редактирования записи в журнале
          <Button onClick={handleAddJournalItem}>Сохранить</Button>
        </Popover>
      </Grid>
    )
  }
  const handleAddJournalItem = () => {}
  if (!journalData || !departmentData) return
  // console.log('format(selectedDate, dd.MM)', format(selectedDate, 'dd.MM'))
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
              key={item.id}
              item
              sx={{ width: '100%' }}
              container
              flexDirection={'row'}
              className='depPlanRow'
            >
              <Grid className={'depPlanCell depPlanDateCell'}>{key.substring(11)}</Grid>
              {departmentData.map((department) => renderCell(department, item, key))}
            </Grid>
          )
        })}
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
            поля для добавления нового времени связи возможно форма
            <Button onClick={handleAddJournalItem}>Добавить</Button>
          </Popover>
        </Grid>
      </Grid>
    </Grid>
  )
}
