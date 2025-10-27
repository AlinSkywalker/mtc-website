import CloseIcon from '@mui/icons-material/Close'
import { Button, Checkbox } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import apiClient from '../../api/api'
import { useFetchEventDepartmentMemberList } from '../../queries/eventDepartment'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { format } from 'date-fns'

export const PlanAscentAcceptDayDialog = ({
  eventId,
  departmentId,
  open,
  setOpen,
  selectedDate,
  setSelectedDate,
  selectedPlan,
}) => {
  const queryClient = useQueryClient()

  const [state, setState] = React.useState({})
  const [start, setStart] = React.useState()
  const [finish, setFinish] = React.useState()

  const { data: selectedDateDepartmentMembers } = useFetchEventDepartmentMemberList({
    eventId,
    departmentId,
    selectedDate,
  })
  useEffect(() => {
    const membersId =
      selectedDateDepartmentMembers?.reduce(
        (acc, item) => ({ ...acc, [item.member_id]: true }), //member_id - id from table member
        {},
      ) || {}
    setState(membersId)
  }, [selectedDateDepartmentMembers])
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    })
  }
  const handleAcceptDay = () => {
    const acceptedMember = []
    Object.entries(state).forEach(([id, checked]) => {
      if (checked) {
        acceptedMember.push(id)
      }
    })
    //  event_start: format(data.event_start, 'yyyy-MM-dd'),
    //         event_finish: format(data.event_finish, 'yyyy-MM-dd'),
    const postData = {
      acceptedMember,
      start: start ? format(start, 'yyyy-MM-dd HH:mm:ss') : null,
      finish: finish ? format(finish, 'yyyy-MM-dd HH:mm:ss') : null,
    }
    apiClient
      .post(
        `/api/eventList/${eventId}/department/${departmentId}/plan/${selectedPlan.id}/accept`,
        postData,
      )
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['event', eventId, 'department', departmentId, 'plan'],
        })
        handleClose()
      })
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedDate()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        Зачесть восхождение
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minWidth: '400px' }}>
        <Box sx={{ display: 'flex', margin: '10px 0' }}>
          <FormControl variant='standard'>
            <DateTimePicker
              label='Старт'
              value={start}
              onChange={(newValue) => setStart(newValue)}
            />
          </FormControl>
          <FormControl variant='standard'>
            <DateTimePicker
              label='На вершине'
              value={finish}
              onChange={(newValue) => setFinish(newValue)}
            />
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <FormControl component='fieldset' variant='standard'>
            <FormGroup>
              {selectedDateDepartmentMembers?.map((item, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={state[item.member_id] || false}
                      onChange={handleChange}
                      name={item.member_id}
                    />
                  }
                  label={item.member_fio}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleAcceptDay} autoFocus>
          Зачесть
        </Button>
      </DialogActions>
    </Dialog>
  )
}
