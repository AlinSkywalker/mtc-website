import React from 'react'
import { useFetchMemberAscentList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { useFetchEventList } from '../../queries/event'
import { dateColumnType, dateTimeColumnType } from '../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { EditCascadeSelectMenu } from '../dataGridCell/EditCascadeSelectMenu'
import { GridEditInputCell } from '@mui/x-data-grid'

const defaultItem = {
  asc_event: '',
  asc_route: '',
  asc_date: '',
  asc_typ: '',
  mount_name_disp: '',
  asc_times: '',
  asc_timesf: '',
}

const validationSchema = Yup.object({
  asc_route: Yup.string().required('Поле обязательно для заполнения'),
  asc_date: Yup.string().required('Поле обязательно для заполнения'),
  asc_typ: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberAscentTab = ({ memberId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchMemberAscentList(memberId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/memberList/${memberId}/ascent`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/memberList/${memberId}/ascent/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'ascent'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/memberList/${memberId}/ascent/${id}`, postedData)
  }, [])

  const renderEventSelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='events'
        nameField='asc_event'
        hook={useFetchEventList}
      />
    )
  }

  const renderSelectEditCell = (params) => {
    return (
      <EditCascadeSelectMenu
        {...params}
        finishDictionary='routeDictionary'
        nameField='asc_route'
        displayField='rout_name'
      />
    )
  }

  const columns = [
    {
      field: 'mount_name',
      headerName: 'Вершина',
      width: 250,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'rout_name',
      headerName: 'Маршрут',
      width: 180,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    {
      field: 'rout_comp',
      headerName: 'К/с',
      width: 80,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'asc_date',
      ...dateColumnType,
      headerName: 'Дата восх.',
      width: 120,
      editable: true,
    },

    {
      field: 'asc_typ',
      headerName: 'Роль',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Участник', 'Инструктор', 'Руководитель'],
    },
    {
      field: 'asc_ruk',
      headerName: 'Руководитель',
      width: 200,
      editable: true,
    },
    {
      field: 'asc_kolu',
      headerName: 'Участников',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'asc_times',
      ...dateTimeColumnType,
      headerName: 'Старт',
      width: 150,
      editable: true,
    },
    {
      field: 'asc_timesf',
      ...dateTimeColumnType,
      headerName: 'На вершине',
      width: 150,
      editable: true,
    },
    {
      field: 'event_name',
      headerName: 'Мероприятие',
      width: 150,
      renderEditCell: renderEventSelectEditCell,
      editable: true,
    },

    { field: 'asc_event', headerName: 'asc_event', width: 0, editable: true },
    { field: 'asc_route', headerName: 'asc_route', width: 0, editable: true },
    { field: 'rout_mount', headerName: 'rout_mount', width: 0, editable: true },
    { field: 'mount_rai', headerName: 'mount_rai', width: 0, editable: true },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
  ]
  const fieldToFocus = 'fio'
  const columnVisibilityModel = {
    asc_event: false,
    asc_route: false,
    rout_mount: false,
    region_name: false,
    rai_reg: false,
    rai_name: false,
    mount_rai: false,
    // mount_name: false,
    // rout_comp: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['member', memberId, 'ascent'] })
  }

  if (!memberId) return null
  return (
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
      isCellEditable={(params) =>
        params.field !== 'fio' || (params.row.isNew && params.field == 'fio')
      }
    />
  )
}
