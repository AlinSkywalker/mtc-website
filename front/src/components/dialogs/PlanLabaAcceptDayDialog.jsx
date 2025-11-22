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
import { DataGrid, GridEditInputCell, Toolbar, useGridApiRef } from '@mui/x-data-grid'
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
  lecturesLabaId,
  practiceLabaId,
}) => {
  const queryClient = useQueryClient()
  const apiRef = useGridApiRef()
  let labaId = selectedPlan.laba
  if (selectedPlan.type === 'Лекция') {
    labaId = lecturesLabaId
  } else if (selectedPlan.type === 'Практика') {
    labaId = practiceLabaId
  }
  console.log('labaId', labaId, selectedPlan.type)
  const { isLoading, data: laboratoryRouteData } = useFetchLaboratoryRouteDictionaryList(labaId)

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

  const [isEditMode, setIsEditMode] = useState(false)

  const applyNewChanges = () => {
    laboratoryRouteData.forEach((row) => {
      const newRow = apiRef.current?.getRowWithUpdatedValues(row.id, 'id') || {}
      setState((prevState) => {
        const newState = { ...prevState }
        newState[newRow.member_id][newRow.id] = newRow
        return newState
      })
    })
  }
  const handleRowSelectionModelChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel)
    let newMemberId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newMemberId = item
    })
    setSelectedMember(newMemberId)

    const routeRows = Object.values(state[newMemberId])

    if (isEditMode) {
      setIsEditMode(false)
      applyNewChanges()
      laboratoryRouteData.forEach((row) => {
        try {
          apiRef.current?.stopRowEditMode({ id: row.id, ignoreModifications: true })
        } catch (err) { }
      })
    }
    apiRef.current?.setRows(routeRows)
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
      headerName: 'Оценка',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Уверенно', 'Не уверенно'],
    },
  ]

  const handleStartEditing = () => {
    if (isEditMode) {
      setIsEditMode(false)
      applyNewChanges()
      laboratoryRouteData.forEach((row) => {
        apiRef.current?.stopRowEditMode({ id: row.id })
      })
    } else {
      setIsEditMode(true)
      laboratoryRouteData.forEach((row) => {
        apiRef.current?.startRowEditMode({ id: row.id })
      })
    }
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
          <Grid size={5} sx={{ height: `calc(100vh - 190px)` }}>
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
          <Grid size={7} sx={{ height: `calc(100vh - 190px)` }}>
            <DataGrid
              apiRef={apiRef}
              columns={labaRouteColumns}
              columnHeaderHeight={36}
              rowHeight={42}
              editMode='row'
              showToolbar
              slots={{
                toolbar: () => {
                  return (
                    <Toolbar>
                      <Button onClick={handleStartEditing} disabled={!selectedMember}>
                        {isEditMode ? 'Применить' : 'Редактировать'}
                      </Button>
                    </Toolbar>
                  )
                },
              }}
            />
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
