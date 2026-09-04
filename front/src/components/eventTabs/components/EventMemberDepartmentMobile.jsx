import React, { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../api/api'
import { useFetchEventMemberList } from '../../../queries/event'
import {
  useFetchEventMemberDepartmentList,
  useFetchEventDepartmentListForMember,
} from '../../../queries/eventDepartment'

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Select,
  MenuItem,
  Button,
  Card,
  Stack,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import { red } from '@mui/material/colors'

export const EventMemberDepartmentMobile = ({ eventId }) => {
  const queryClient = useQueryClient()
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMassDepartment, setSelectedMassDepartment] = useState('')

  // --- ДАННЫЕ: Список участников ---
  const { data: membersData } = useFetchEventMemberList(eventId)

  const filteredMembers = useMemo(() => {
    if (!membersData) return []
    return membersData.filter((m) => m.fio.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [membersData, searchQuery])

  // --- ДАННЫЕ: Детали выбранного участника ---
  const { data: departmentDatesData } = useFetchEventMemberDepartmentList({
    eventId,
    memberId: selectedMember?.id,
  })

  const { data: availableDepartments } = useFetchEventDepartmentListForMember({
    eventId,
    memberId: selectedMember?.id,
  })

  // --- ЭКШЕНЫ ---
  const handleMassApply = async () => {
    if (!selectedMassDepartment || !selectedMember) return
    await apiClient.post(
      `/api/eventList/${eventId}/member/${selectedMember.id}/departmentForAllDates`,
      { departmentId: selectedMassDepartment },
    )
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'member', selectedMember.id, 'departmentByDate'],
    })
  }

  const handleDateDepartmentChange = async (dateRow, newDepartmentValue) => {
    const postedData = {
      ...dateRow,
      membd_dep: newDepartmentValue?.id || null,
      department: newDepartmentValue?.depart_name || '',
    }
    await apiClient.post(
      `/api/eventList/${eventId}/member/${selectedMember?.id}/departmentForDate`,
      postedData,
    )
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'member', selectedMember?.id, 'departmentByDate'],
    })
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'member'],
    })
  }

  if (!eventId) return null

  // ==========================================
  // ЭКРАН 1: СПИСОК УЧАСТНИКОВ
  // ==========================================
  if (!selectedMember) {
    return (
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size='small'
          placeholder='Поиск по ФИО...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
          {filteredMembers.map((member) => (
            <ListItemButton key={member.id} onClick={() => setSelectedMember(member)} divider>
              <ListItemText
                primary={member.fio}
                secondary={!member.allDaysWithDept ? 'Есть незаполненные дни' : 'Заполнено'}
                secondaryTypographyProps={{
                  color: !member.allDaysWithDept ? red[500] : 'text.secondary',
                }}
              />
              {!member.allDaysWithDept && <ErrorIcon sx={{ color: red[500] }} />}
            </ListItemButton>
          ))}
        </List>
      </Box>
    )
  }

  // ==========================================
  // ЭКРАН 2: РАСПИСАНИЕ УЧАСТНИКА
  // ==========================================
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      <AppBar position='static' color='inherit' elevation={1}>
        <Toolbar>
          <IconButton edge='start' onClick={() => setSelectedMember(null)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='subtitle1' sx={{ ml: 1, noWrap: true, fontWeight: 'bold' }}>
            {selectedMember.fio}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Панель массовых действий */}
      <Paper sx={{ p: 2, position: 'sticky', top: 0, zIndex: 10, borderRadius: 0, mb: 2 }}>
        <Select
          size='small'
          fullWidth
          displayEmpty
          value={selectedMassDepartment}
          onChange={(e) => setSelectedMassDepartment(e.target.value)}
          sx={{ mb: 1 }}
        >
          <MenuItem value=''>
            <em>Выбрать для всех дат...</em>
          </MenuItem>
          {availableDepartments?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {`${item.depart_tip} ${item.depart_name}`}
            </MenuItem>
          ))}
        </Select>
        <Button
          fullWidth
          variant='contained'
          startIcon={selectedMassDepartment ? <AddIcon /> : null}
          onClick={handleMassApply}
        >
          {selectedMassDepartment ? 'Назначить на все даты' : 'Сбросить'}
        </Button>
      </Paper>

      {/* Список дат (вместо правого DataGrid) */}
      <Stack spacing={1.5} sx={{ px: 2 }}>
        {departmentDatesData?.map((dateRow) => {
          const currentPlan = dateRow.department ? dateRow.depart_plan : 'Нет плана'

          return (
            <Card
              key={dateRow.id || dateRow.membd_date}
              elevation={0}
              sx={{ p: 2, border: '1px solid #e0e0e0' }}
            >
              <Typography variant='subtitle2' fontWeight='bold' sx={{ mb: 1 }}>
                {dateRow.membd_date}
              </Typography>

              <Select
                size='small'
                fullWidth
                displayEmpty
                value={dateRow.membd_dep || ''}
                onChange={(e) => {
                  const dept = availableDepartments.find((d) => d.id === e.target.value)
                  handleDateDepartmentChange(dateRow, dept)
                }}
                sx={{ mb: 1 }}
              >
                <MenuItem value=''>
                  <em>Не выбрано</em>
                </MenuItem>
                {availableDepartments?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.depart_name}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant='caption' color='text.secondary'>
                План: {currentPlan}
              </Typography>
            </Card>
          )
        })}
      </Stack>
    </Box>
  )
}
