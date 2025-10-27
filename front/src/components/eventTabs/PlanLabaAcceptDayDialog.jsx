import CloseIcon from '@mui/icons-material/Close'
import { Button, Grid } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import apiClient from '../../api/api'
import { useFetchEventDepartmentMemberList } from '../../queries/eventDepartment'
import { DataGrid, GridEditInputCell } from '@mui/x-data-grid'
import { useFetchLaboratoryRouteDictionaryList } from '../../queries/dictionary'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { useFetchEventDepartPlanLabaAscent } from '../../queries/eventDepartPlanLabaAscent'

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
}) => {
  const queryClient = useQueryClient()

  const { isLoading, data: laboratoryRouteData } = useFetchLaboratoryRouteDictionaryList(
    selectedPlan.laba,
  )

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

  const [laboratoryRouteRows, setLaboratoryRouteRows] = React.useState([])
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
                let ascent_belay = 'Нижняя'
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
  // console.log('state', state)

  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    let newMemberId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newMemberId = item
    })
    setSelectedMember(newMemberId)

    const routeRows = Object.values(state[newMemberId] || {})
    setLaboratoryRouteRows(routeRows)
  }
  const handleAcceptDay = () => {
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
        `/api/eventList/${eventId}/department/${departmentId}/plan/${selectedPlan.id}/labaAscents`,
        postData,
      )
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['event', eventId, 'department', departmentId, 'plan'],
        })
        handleClose()
      })
  }

  const processRouteRowUpdate = (newRow) => {
    setState((prevState) => {
      const newState = { ...prevState }
      newState[selectedMember][newRow.id] = newRow
      return newState
    })
    return newRow
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

  const labaRouteColumns = [
    {
      field: 'done',
      headerName: '',
      width: 100,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'labatr_name',
      headerName: 'Название трассы',
      editable: true,
      width: 300,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'labatr_sl',
      headerName: 'Сложность',
      width: 100,
    },
    {
      field: 'ascent_belay',
      headerName: 'Страховка',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Верхняя', 'Нижняя'],
    },
    {
      field: 'ascent_type',
      headerName: 'Тип пролаза',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Онсайт', 'Флеш', 'Редпоинт'],
    },
  ]

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
          <Grid size={5} sx={{ height: `calc(100vh - 190px)` }}>
            <DataGrid
              editMode='row'
              rows={memberRows}
              columns={membersColumns}
              columnHeaderHeight={36}
              rowHeight={42}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              rowSelectionModel={rowSelectionModel}
            />
          </Grid>
          <Grid size={7} sx={{ height: `calc(100vh - 190px)` }}>
            <DataGrid
              rows={laboratoryRouteRows}
              columns={labaRouteColumns}
              columnHeaderHeight={36}
              rowHeight={42}
              editMode='row'
              processRowUpdate={processRouteRowUpdate}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleAcceptDay} autoFocus>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
