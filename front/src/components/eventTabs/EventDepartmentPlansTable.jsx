import React from 'react'
import {
  useFetchEventDepartmentPlanList,
  useFetchEventDepartmentMemberList,
} from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchLaboratoryForEvent } from '../../queries/dictionary'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { EditCascadeSelectMenu } from '../dataGridCell/EditCascadeSelectMenu'
import { Button } from '@mui/material'
import { PlanAscentAcceptDayDialog } from './PlanAscentAcceptDayDialog'
import { MultiValueSelecWithGroupingtEditInputCell } from '../dataGridCell/MultiValueSelecWithGroupingtEditInputCell'
import { eventDepartmentPlanValidationSchema } from '../../validations/eventDepartmentPlanValidation'
import {
  plansTableHiddenColumns,
  plansTableColumnVisibilityModel,
} from './eventDepartmentPlansTableSettings'

export const EventDepartmentPlansTable = ({
  eventId,
  departmentId,
  eventDistrict,
  departmentStartDate,
  departmentEndDate,
}) => {
  const queryClient = useQueryClient()

  const defaultItem = {
    route: '',
    start: '',
    ob_agreement: 0,
    // ascplan_ruk: '',
    type: '',
    laba: '',
    departmentStartDate,
    departmentEndDate,
    progp: '',
    prog_tem: '',
  }

  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState()
  const [selectedPlan, setSelectedPlan] = React.useState()

  const { isLoading, data } = useFetchEventDepartmentPlanList(eventId, departmentId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/department/${departmentId}/plan/`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient
      .delete(`/api/eventList/${eventId}/department/${departmentId}/plan/${id}`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['event', eventId, 'department', departmentId, 'plan'],
        })
      })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(
      `/api/eventList/${eventId}/department/${departmentId}/plan/${id}`,
      postedData,
    )
  }, [])

  const renderRouteSelectEditCell = (params) => {
    return (
      <EditCascadeSelectMenu
        {...params}
        finishDictionary='routeDictionary'
        nameField='route'
        displayField='rout_name'
        fixedDistrict={eventDistrict}
      />
    )
  }
  const renderLabaSelectEditCell = (params) => {
    const hookParams = {
      eventId,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='laboratoryDictionary'
        nameField='laba'
        hook={useFetchLaboratoryForEvent}
        hookParams={hookParams}
      />
    )
  }

  const renderProgramSelectEditCell = (params) => {
    return (
      <MultiValueSelecWithGroupingtEditInputCell
        {...params}
        dictionaryName='trainingProgram'
        nameListField='program_name_list'
        idListField='program_id_list'
        displayNameField='program_name'
        groupByField='prog_razd'
        labelField='prog_tem'
      />
    )
  }
  const renderAscentHeadSelectEditCell = (params) => {
    const hookParams = {
      eventId,
      departmentId: departmentId,
      selectedDate: params.row.start,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='departMembers'
        nameField='ascent_head'
        hook={useFetchEventDepartmentMemberList}
        hookParams={hookParams}
      />
    )
  }

  const renderAcceptButtonCell = (params) => {
    const buttonElement = React.useRef(null)
    if (params.row.type !== 'Восхождение') {
      return <></>
    }
    const itemDate = new Date(params.row.start)
    const isFutureDate = new Date() < itemDate
    return (
      <Button
        size='small'
        variant='contained'
        onClick={handleClickOpen(params.row.start, params.row.id)}
        ref={buttonElement}
        disabled={!!params.row.accepted || isFutureDate}
      >
        Результат
      </Button>
    )
  }

  const handleClickOpen = (clickDate, clickPlan) => () => {
    setOpen(true)
    setSelectedDate(clickDate)
    setSelectedPlan(clickPlan)
  }

  const columns = [
    {
      field: 'start',
      ...dateColumnType,
      headerName: 'Дата',
      width: 120,
      editable: true,
      minDate: 'departmentStartDate',
    },
    {
      field: 'type',
      headerName: 'Тип',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Заезд', 'Подход/отход', 'Восхождение', 'Занятие', 'Отдых', 'Отъезд'],
    },
    {
      field: 'rout_name',
      headerName: 'Маршрут',
      width: 200,
      renderEditCell: renderRouteSelectEditCell,
      editable: true,
      valueGetter: (value, row) => {
        if (value) return `${value} (${row.rout_comp}, ${row.mount_name})`
        else return value
      },
    },
    {
      field: 'ascent_head_fio',
      headerName: 'Руковод',
      width: 200,
      renderEditCell: renderAscentHeadSelectEditCell,
      editable: true,
    },
    {
      field: 'laba_name',
      headerName: 'Лаборатория',
      width: 200,
      renderEditCell: renderLabaSelectEditCell,
      editable: true,
    },
    {
      field: 'program_name',
      headerName: 'Программа подготовки',
      width: 250,
      renderEditCell: renderProgramSelectEditCell,
      editable: true,
    },
    {
      field: 'accept_day',
      headerName: '',
      width: 125,
      renderCell: renderAcceptButtonCell,
    },
    ...plansTableHiddenColumns,
  ]

  const fieldToFocus = 'depart_tip'
  const columnVisibilityModel = plansTableColumnVisibilityModel

  const processRowUpdate = async (newRow) => {
    eventDepartmentPlanValidationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({
      queryKey: ['event', eventId, 'department', departmentId, 'plan'],
    })
  }
  if (!eventId || !departmentId) return null
  return (
    <>
      <EditableTable
        rows={rows}
        setRows={setRows}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        columns={columns}
        processRowUpdate={processRowUpdate}
        fieldToFocus={fieldToFocus}
        columnVisibilityModel={columnVisibilityModel}
        defaultItem={defaultItem}
        isLoading={isLoading}
        handleDeleteItem={handleDeleteItem}
        height={400}
        addButtonDisabled={!departmentId}
      />
      {selectedDate && (
        <PlanAscentAcceptDayDialog
          departmentId={departmentId}
          eventId={eventId}
          selectedDate={selectedDate}
          selectedPlan={selectedPlan}
          open={open}
          setOpen={setOpen}
          setSelectedDate={setSelectedDate}
        />
      )}
    </>
  )
}
