import CloseIcon from '@mui/icons-material/Close'
import { Button, Checkbox, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import apiClient from '../../../api/api'
import { useFetchEventDepartmentMemberList } from '../../../queries/eventDepartment'
import { DataGrid, Toolbar } from '@mui/x-data-grid'
import { useFetchLaboratoryRouteDictionaryList } from '../../../queries/dictionary'

import { useFetchEventDepartPlanLabaAscent } from '../../../queries/eventDepartPlanLabaAscent'

const emptyRowSelection = {
  type: 'include',
  ids: new Set(),
}

export const PlanLabaAcceptDayDialog = ({
  eventId,
  departmentId,
  open,
  setOpen,
  selectedDate,
  setSelectedDate,
  selectedPlan,
  lecturesLabaId,
  practiceLabaId,
}) => {
  const queryClient = useQueryClient()

  let labaId = selectedPlan.laba
  if (selectedPlan.type === 'Лекция') {
    labaId = lecturesLabaId
  } else if (selectedPlan.type === 'Практика') {
    labaId = practiceLabaId
  }
  const { isLoading, data: laboratoryRouteData } = useFetchLaboratoryRouteDictionaryList({
    laboratoryId: labaId,
  })

  const [state, setState] = useState({})
  const [selectedMember, setSelectedMember] = useState('')

  const [rowSelectionModel, setRowSelectionModel] = useState(emptyRowSelection)

  const { data: selectedDateDepartmentMembers } = useFetchEventDepartmentMemberList({
    eventId,
    departmentId,
    selectedDate,
  })

  const { isLoading: isLabaAscentsLoading, data: selectedDateDepartmentLabaAscents } =
    useFetchEventDepartPlanLabaAscent(eventId, departmentId, selectedPlan.id)

  const [memberRows, setMemberRows] = React.useState(selectedDateDepartmentMembers)

  React.useEffect(() => {
    setMemberRows(selectedDateDepartmentMembers?.map((item) => ({ ...item, id: item.member_id })))
  }, [selectedDateDepartmentMembers])

  useEffect(() => {
    if (laboratoryRouteData?.length && selectedDateDepartmentMembers?.length) {
      const membersId =
        selectedDateDepartmentMembers?.reduce(
          (acc, memberItem) => {
            const labaRoutes = laboratoryRouteData.reduce(
              (routeAcc, { id, labatr_name, labatr_sl }) => {
                let done = false
                let ascent_belay = 'Уверенно'
                let ascent_type = 'Онсайт'
                if (!isLabaAscentsLoading) {
                  const savedAscent = selectedDateDepartmentLabaAscents.find(
                    (ascentItem) =>
                      ascentItem.ascent_member === memberItem.member_id &&
                      ascentItem.laba_route === id,
                  )
                  if (savedAscent) {
                    done = true
                    ascent_belay = savedAscent.ascent_belay
                    ascent_type = savedAscent.ascent_type
                  }
                }
                return {
                  ...routeAcc,
                  [id]: {
                    id,
                    done,
                    labatr_name,
                    labatr_sl,
                    ascent_belay,
                    ascent_type,
                    member_id: memberItem.member_id,
                  },
                }
              },
              {},
            )
            return { ...acc, [memberItem.member_id]: labaRoutes }
          }, //member_id - id from table member
          {},
        ) || {}
      setState(membersId)
    }
  }, [selectedDateDepartmentMembers, laboratoryRouteData, selectedDateDepartmentLabaAscents])

  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    let newMemberId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newMemberId = item
    })
    setSelectedMember(newMemberId)
  }

  const handleAcceptDay = (withAccept) => () => {
    const data = []
    Object.entries(state).forEach(([memberId, routeObject]) => {
      Object.values(routeObject)
        .filter((route) => route.done)
        .forEach((route) => {
          data.push({ ...route, ascent_member: memberId, laba_route: route.id })
        })
    })
    if (!data.length) return

    const postData = {
      data,
      ascent_date: selectedDate,
    }
    apiClient
      .put(
        `/api/eventList/${eventId}/department/${departmentId}/plan/${selectedPlan.id}/labaAscents?withAccept=${withAccept}`,
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

  const membersColumns = [
    {
      field: 'member_fio',
      headerName: 'ФИО участника',
      width: 400,
    },
  ]

  const handleCheckRoute = (routeId) => (event) => {
    setState((prevState) => {
      const newState = { ...prevState }
      newState[selectedMember][routeId].done = event.target.checked
      return newState
    })
  }
  const handleChangeMark = (routeId) => (event) => {
    setState((prevState) => {
      const newState = { ...prevState }
      newState[selectedMember][routeId].ascent_belay = event.target.value
      return newState
    })
  }
  const renderRouteItem = (routeItem) => {
    return (
      <Grid container alignItems={'center'} key={routeItem.id}>
        <Grid size={1}>
          <Checkbox checked={routeItem.done} onChange={handleCheckRoute(routeItem.id)} />
        </Grid>
        <Grid size={5}>
          <Typography>{routeItem.labatr_name}</Typography>
        </Grid>
        <Grid size={2}>
          <Typography>{routeItem.labatr_sl}</Typography>
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth size='small'>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={routeItem.ascent_belay}
              onChange={handleChangeMark(routeItem.id)}
            >
              <MenuItem value={'Уверенно'}>Уверенно</MenuItem>
              <MenuItem value={'Не уверенно'}>Не уверенно</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth='xl'>
      <DialogTitle>
        Зачесть занятие
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

      <DialogContent sx={{ minWidth: '800px' }}>
        <Grid container>
          <Grid size={3} sx={{ height: `calc(100vh - 190px)` }}>
            <DataGrid
              editMode='row'
              rows={memberRows}
              columns={membersColumns}
              columnHeaderHeight={36}
              rowHeight={42}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              rowSelectionModel={rowSelectionModel}
              showToolbar
              slots={{
                toolbar: () => {
                  return <Toolbar />
                },
              }}
            />
          </Grid>
          <Grid size={9} sx={{ height: `calc(100vh - 190px)`, overflowY: 'scroll' }}>
            <Grid container alignItems={'center'}>
              <Grid size={1}></Grid>
              <Grid size={5}>
                <Typography>Название трассы</Typography>
              </Grid>
              <Grid size={2}>
                <Typography>Сложность</Typography>
              </Grid>
              <Grid size={4}>
                <Typography>Оценка</Typography>
              </Grid>
            </Grid>
            {selectedMember && Object.values(state[selectedMember])?.map(renderRouteItem)}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleAcceptDay(false)}>Сохранить</Button>
        <Button onClick={handleAcceptDay(true)} autoFocus variant='contained'>
          Сохранить и зачесть
        </Button>
      </DialogActions>
    </Dialog>
  )
}
