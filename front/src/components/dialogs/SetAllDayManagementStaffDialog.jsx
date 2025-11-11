import React, { useState } from 'react'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { useFetchMemberList } from '../../queries/member'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export const SetAllDayManagementStaffDialog = ({ open, setOpen, eventId }) => {
  const queryClient = useQueryClient()

  const { data: stData } = useFetchMemberList({ possibleRole: 'st' })
  const { data: obData } = useFetchMemberList({ possibleRole: 'ob' })
  const { data: doctorData } = useFetchMemberList()

  const [st, setSt] = useState()
  const [ob, setOb] = useState()
  const [doctor, setDoctor] = useState()

  const handleSetSt = async () => {
    await apiClient.put(`/api/eventList/${eventId}/eventManagementStuffFromEvent/st`, { st })
    setOpen(false)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventManagementStuff'] })
  }
  const handleSetOb = async () => {
    await apiClient.put(`/api/eventList/${eventId}/eventManagementStuffFromEvent/ob`, { ob })
    setOpen(false)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventManagementStuff'] })
  }
  const handleSetDoctor = async () => {
    await apiClient.put(`/api/eventList/${eventId}/eventManagementStuffFromEvent/doctor`, {
      doctor,
    })
    setOpen(false)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eventManagementStuff'] })
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>
        Назначить на все даты
        <IconButton
          aria-label='close'
          onClick={() => setOpen(false)}
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
        <Box sx={{ display: 'flex', margin: '10px 0', alignItems: 'center' }}>
          <FormControl variant='standard'>
            <InputLabel id='st-label'>СТ</InputLabel>
            <Select
              sx={{ width: '300px' }}
              labelId='st-label'
              value={st}
              label='СТ'
              onChange={(event) => setSt(event.target.value)}
            >
              {stData?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.fio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='standard' sx={{ ml: 1 }}>
            <Button onClick={handleSetSt} variant='contained'>
              Назначить СТ
            </Button>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', margin: '10px 0', alignItems: 'center' }}>
          <FormControl variant='standard'>
            <InputLabel id='ob-label'>ОБ</InputLabel>
            <Select
              sx={{ width: '300px' }}
              labelId='ob-label'
              value={ob}
              label='ОБ'
              onChange={(event) => setOb(event.target.value)}
            >
              {obData?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.fio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='standard' sx={{ ml: 1 }}>
            <Button onClick={handleSetOb} variant='contained'>
              Назначить ОБ
            </Button>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', margin: '10px 0', alignItems: 'center' }}>
          <FormControl variant='standard'>
            <InputLabel id='doctor-label'>Врач</InputLabel>
            <Select
              sx={{ width: '300px' }}
              labelId='doctor-label'
              value={doctor}
              label='Врач'
              onChange={(event) => setDoctor(event.target.value)}
            >
              {doctorData?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.fio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='standard' sx={{ ml: 1 }}>
            <Button onClick={handleSetDoctor} variant='contained'>
              Назначить врача
            </Button>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
