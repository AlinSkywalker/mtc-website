import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Button,
  DialogActions,
  Box,
  FormControl,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { DatePicker } from '@mui/x-date-pickers'
import apiClient from '../../api/api'
import { AuthContext } from '../AuthContext'
import { format } from 'date-fns'
import { useFetchEventDepartmentList } from '../../queries/eventDepartment'
import { DEPARTMENT_TYPE_ARRAY } from '../../constants'
import { useIsMobile } from '../../hooks/useIsMobile'

export const EventApplicationDialog = ({ eventId, open, setOpen }) => {
  const {
    userInfo: { memberId: currentMemberId },
  } = useContext(AuthContext)

  const isMobile = useIsMobile()

  const handleClose = () => {
    setDepartment('')
    setDepartmentType('')
    setStart(undefined)
    setFinish(undefined)
    setOpen(false)
  }
  const { isLoading, data } = useFetchEventDepartmentList(eventId)

  const [start, setStart] = useState()
  const [finish, setFinish] = useState()
  const [departmentType, setDepartmentType] = useState('')
  const [department, setDepartment] = useState('')

  const isSendEnabled = department || (start && finish && departmentType)

  const handleSendApplication = () => {
    let resultDepartmentType = departmentType
    let resultStartDate = start
    let resultFinishData = finish
    if (department) {
      const departmentData = data?.find((item) => item.id === department) || {}
      resultDepartmentType = departmentData.depart_tip
      resultStartDate = departmentData.depart_dates
      resultFinishData = departmentData.depart_datef
    }

    const postData = {
      date_start: resultStartDate ? format(resultStartDate, 'yyyy-MM-dd') : null,
      date_finish: resultFinishData ? format(resultFinishData, 'yyyy-MM-dd') : null,
      department_type: resultDepartmentType,
      member: currentMemberId,
    }
    apiClient.put(`/api/eventList/${eventId}/eventApplication`, postData).then((res) => {
      handleClose()
    })
  }

  const handleSelectDepartment = (newValue) => () => {
    setDepartment(newValue)
    setDepartmentType('')
    setStart(undefined)
    setFinish(undefined)
  }

  const handleSelectManualDepartmentType = (newValue) => () => {
    setDepartmentType(newValue)
    setDepartment('')
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth='sm'>
      <DialogTitle>
        Заявка на участие
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

      <DialogContent sx={{ minWidth: '300px' }}>
        <Box>
          <Typography variant='subtitle1' sx={{ fontWeight: '600' }}>
            Выберите подходящее отделение:
          </Typography>
          <FormControl variant='standard' fullWidth>
            <TextField
              id='outlined-select-currency'
              select
              label='Выберите подходящее отделение'
              // defaultValue=''
              value={department}
            >
              {data?.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  onClick={handleSelectDepartment(option.id)}
                >
                  {`${option.depart_tip} ${option.depart_dates} - ${option.depart_datef}`}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Box>
        <Box>
          <Typography variant='subtitle1' sx={{ fontWeight: '600' }}>
            Или укажите желаемый тип отделения и даты заезда/отъезда
          </Typography>
          <FormControl variant='standard' fullWidth sx={{ mt: 1 }}>
            <TextField
              // id="outlined-select-currency"
              select
              label='Выберите подходящее отделение'
              defaultValue=''
            >
              {['', ...DEPARTMENT_TYPE_ARRAY].map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  onClick={handleSelectManualDepartmentType(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <Grid container>
            <Grid size={isMobile ? 12 : 6}>
              <FormControl
                variant='standard'
                fullWidth
                sx={isMobile ? { mt: 1 } : { mt: 1, pr: 1 }}
              >
                <DatePicker
                  label='Дата заезда'
                  value={start}
                  onChange={(newValue) => setStart(newValue)}
                />
              </FormControl>
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
              <FormControl
                variant='standard'
                fullWidth
                sx={isMobile ? { mt: 1 } : { mt: 1, pl: 1 }}
              >
                <DatePicker
                  label='Дата выезда'
                  value={finish}
                  onChange={(newValue) => setFinish(newValue)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          onClick={handleSendApplication}
          autoFocus
          variant='contained'
          disabled={!isSendEnabled}
        >
          Отправить заявку
        </Button>
      </DialogActions>
    </Dialog>
  )
}
