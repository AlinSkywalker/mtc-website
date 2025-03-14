import React from 'react'
import {
  useFetchEventDepartmentPlanList,
  useFetchEventDepartmentMemberList,
} from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchLaboratoryForEvent } from '../../queries/dictionary'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { EditCascadeSelectMenu } from '../dataGridCell/EditCascadeSelectMenu'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { EditTrainingProgramMenu } from '../dataGridCell/EditTrainingProgramMenu'
import { Button } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { MultiValueSelecWithGroupingtEditInputCell } from '../dataGridCell/MultiValueSelecWithGroupingtEditInputCell'

const validationSchema = Yup.object({
  type: Yup.string().required('Поле обязательно для заполнения'),
  start: Yup.string().required('Поле обязательно для заполнения'),
  laba_name: Yup.string()
    .nullable(true)
    .test({
      name: '2',
      exclusive: false,
      params: {},
      message: 'Для занятия обязательна лаборатория',
      test: (value, context) => value == null || !(context.parent.type == 'Занятие' && !value),
    }),
  rout_name: Yup.string()
    .nullable(true)
    .test({
      name: '2',
      exclusive: false,
      params: {},
      message: 'Для восхождения обязателен маршрут',
      test: (value, context) => value == null || !(context.parent.type == 'Восхождение' && !value),
    }),
})

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

  const { isLoading, data } = useFetchEventDepartmentPlanList(eventId, departmentId)
  const { data: selectedDateDepartmentMembers } = useFetchEventDepartmentMemberList(
    eventId,
    departmentId,
    selectedDate,
  )

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

  const renderProgpSelectEditCell = (params) => {
    return <EditTrainingProgramMenu {...params} nameField='progp' displayField='prog_tem' />
  }
  const handleAcceptDay = (params) => () => {
    apiClient
      .post(`/api/eventList/${eventId}/department/${departmentId}/plan/${params.row.id}/accept`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['event', eventId, 'department', departmentId, 'plan'],
        })
      })
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
        // secondarySource='alprazr'
        // secondarySourceArray={['alprazr', 'skali', 'ledu']}
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
        onClick={handleAcceptDay(params)}
        ref={buttonElement}
        disabled={params.row.accepted || isFutureDate}
      >
        Зачесть
      </Button>
    )
  }

  const handleClickOpen = (clickDate) => () => {
    setOpen(true)
    console.log('clickDate', clickDate)
    setSelectedDate(clickDate)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const renderEstimateButtonCell = (params) => {
    const buttonElement = React.useRef(null)
    return (
      <Button
        size='small'
        variant='contained'
        onClick={handleClickOpen(params.row.start)}
        ref={buttonElement}
      >
        Оценка
      </Button>
    )
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
    // {
    //   field: 'prog_tem',
    //   headerName: 'Программа подготовки',
    //   width: 200,
    //   renderEditCell: renderProgpSelectEditCell,
    //   editable: true,
    // },
    {
      field: 'program_name',
      headerName: 'Программа подготовки',
      width: 250,
      renderEditCell: renderProgramSelectEditCell,
      editable: true,
    },
    {
      field: 'ob_agreement',
      headerName: 'Согл ОБ',
      width: 150,
      editable: true,
      ...checkboxColumnType,
    },
    {
      field: 'accept_day',
      headerName: '',
      width: 120,
      renderCell: renderAcceptButtonCell,
    },
    {
      field: 'estimate_day',
      headerName: '',
      width: 120,
      renderCell: renderEstimateButtonCell,
    },
    { field: 'progp', headerName: 'progp', width: 0, editable: true },
    { field: 'laba', headerName: 'laba', width: 0, editable: true },
    { field: 'route', headerName: 'route', width: 0, editable: true },
    { field: 'rout_mount', headerName: 'rout_mount', width: 0, editable: true },
    { field: 'mount_rai', headerName: 'mount_rai', width: 0, editable: true },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
    { field: 'l_rai_name', headerName: 'rai_name', width: 0, editable: true },
    { field: 'l_rai_reg', headerName: 'rai_reg', width: 0, editable: true },
    { field: 'l_region_name', headerName: 'region_name', width: 0, editable: true },
    { field: 'program_id_list', headerName: 'program_id_list', width: 0, editable: true },
    { field: 'program_name_list', headerName: 'program_name_list', width: 0, editable: true },
    { field: 'ascent_head', headerName: 'ascent_head', width: 0, editable: true },
  ]

  const fieldToFocus = 'depart_tip'
  const columnVisibilityModel = {
    rout_mount: false,
    region_name: false,
    rai_reg: false,
    rai_name: false,
    mount_rai: false,
    laba: false,
    route: false,
    l_rai_name: false,
    l_rai_reg: false,
    l_region_name: false,
    progp: false,
    program_id_list: false,
    program_name_list: false,
    ascent_head: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
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
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Оценка</DialogTitle>
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
        <DialogContent></DialogContent>
        <Grid2>{/* {selectedDateDepartmentMembers?.map()} */}</Grid2>
      </Dialog>
    </>
  )
}
