import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import './EventAllDepartmentPlansTableStyle.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Button, Popover } from '@mui/material'
import apiClient from '../../api/api'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import EditIcon from '@mui/icons-material/Edit'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'

export const EventDepartmentPlanJournalCell = ({
  eventId,
  department,
  journalItem,
  date,
  fetchJournalData,
}) => {
  const [placePlan, setPlacePlan] = useState('')
  const [placeFact, setPlaceFact] = useState('')
  const [direction, setDirection] = useState('')

  const [anchorElJournalItem, setAnchorElJournalItem] = React.useState(null)

  const handleClickJournalItem = (clickPlacePlan, clickPlaceFact, clickDirection) => (event) => {
    setAnchorElJournalItem(event.currentTarget)
    setPlacePlan(clickPlacePlan)
    setPlaceFact(clickPlaceFact)
    setDirection(clickDirection)
  }
  const handleCloseJournalItem = () => {
    setAnchorElJournalItem(null)
  }
  const openJournalItem = Boolean(anchorElJournalItem)
  const departmentJournalItem = journalItem[department.id]
  // console.log('departmentJournalItem', departmentJournalItem?.id)

  const handleEditJournalItem = () => {
    const postData = { place_plan: placePlan, direction, place_fact: placeFact }
    const putData = { ...postData, comm_time: date, dept_id: department.id }
    // console.log('departmentJournalItem', departmentJournalItem)
    const apiMethod = departmentJournalItem
      ? apiClient.post(
        `/api/eventList/${eventId}/departments/planJournal/${departmentJournalItem.id}`,
        postData,
      )
      : apiClient.put(`/api/eventList/${eventId}/departments/planJournal`, putData)
    apiMethod.then((data) => {
      handleCloseJournalItem()
      fetchJournalData()
    })
  }
  return (
    <Grid
      container
      key={department.id}
      className={'depPlanCell depPlanCell-inner depPlanJournalCell'}
      wrap='nowrap'
    >
      {departmentJournalItem && (
        <Grid sx={{ textAlign: 'center' }} flexGrow={1}>
          Направление:
          {departmentJournalItem.direction}
          <br />
          Факт местоположение:
          {departmentJournalItem.place_fact}
          <br />
          План местоположение:
          {departmentJournalItem.place_plan}
        </Grid>
      )}
      <Grid sx={{ textAlign: 'center' }}>
        <IconButton
          color='primary'
          onClick={handleClickJournalItem(
            departmentJournalItem?.place_plan || '',
            departmentJournalItem?.place_fact || '',
            departmentJournalItem?.direction || '',
          )}
        >
          <EditIcon />
        </IconButton>
      </Grid>

      <Popover
        open={openJournalItem}
        anchorEl={anchorElJournalItem}
        onClose={handleCloseJournalItem}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Card>
          <CardContent>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <TextField
                label='Место план'
                variant='outlined'
                value={placePlan}
                onChange={(event) => setPlacePlan(event.target.value)}
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <TextField
                label='Место факт'
                variant='outlined'
                value={placeFact}
                onChange={(event) => setPlaceFact(event.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id='direction-label'>Направление движения</InputLabel>
              <Select
                labelId='direction-label'
                value={direction}
                label='Направление движения'
                onChange={(event) => setDirection(event.target.value)}
              >
                <MenuItem value='Подъем'>Подъем</MenuItem>
                <MenuItem value='Спуск'>Спуск</MenuItem>
                <MenuItem value='Бивуак'>Бивуак</MenuItem>
                <MenuItem value='Пропуск'>Пропуск</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button onClick={handleEditJournalItem}>Сохранить</Button>
          </CardActions>
        </Card>
      </Popover>
    </Grid>
  )
}
