import React from 'react'
import {
  useFetchEventBaseHouseRoomList,
  useFetchBaseHouseRoomForEvent,
  useFetchBaseHouseForEvent,
} from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { GridEditInputCell } from '@mui/x-data-grid'

const defaultItem = {
  basenom_name: '',
  date_st: '',
  date_f: '',
}

const validationSchema = Yup.object({
  basenom_name: Yup.string().required('Поле обязательно для заполнения'),
  date_st: Yup.string().required('Поле обязательно для заполнения'),
  date_f: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventBaseHouseRoomTable = ({ eventId, onRowSelectionModelChange }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventBaseHouseRoomList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/baseHouseRoom`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/baseHouseRoom/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'baseHouseRoom'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/baseHouseRoom/${id}`, postedData)
  }, [])

  const renderSelectHouseEditCell = (params) => {
    const hookParams = {
      eventId,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='baseHouseDictionary'
        nameField='basehouse_id'
        hook={useFetchBaseHouseForEvent}
        hookParams={hookParams}
        secondarySource='base_name'
      // secondarySourceArray={['base_name', 'basefd_name']}
      // pickMap={pickMap}
      />
    )
  }
  const renderSelectEditCell = (params) => {
    const hookParams = {
      eventId,
      houseId: params.row.basehouse_id,
    }
    const pickMap = {
      basenom_mest: 'basenom_mest',
      // basefd_name: 'basefd_name',
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='baseHouseRoomDictionary'
        nameField='basefd'
        hook={useFetchBaseHouseRoomForEvent}
        hookParams={hookParams}
        secondarySource='basefd_name'
        secondarySourceArray={['base_name', 'basefd_name']}
        pickMap={pickMap}
      />
    )
  }

  const columns = [
    {
      field: 'basefd_name',
      headerName: 'Дом',
      width: 250,
      editable: true,
      renderEditCell: renderSelectHouseEditCell,
      valueGetter: (value, row) => {
        return value ? `${value}, ${row.base_name}` : ''
      }
    },
    {
      field: 'basenom_name',
      headerName: 'Номер',
      width: 200,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    {
      field: 'basenom_mest',
      headerName: 'Мест',
      width: 80,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    { field: 'date_st', ...dateColumnType, headerName: 'Начало', width: 120, editable: true },
    {
      field: 'date_f',
      ...dateColumnType,
      headerName: 'Конец',
      width: 120,
      editable: true,
      minDate: 'date_st',
    },

    { field: 'basefd', headerName: 'basefd', width: 0, editable: true },
    { field: 'basehouse_id', headerName: 'basehouse_id', width: 0, editable: true },
  ]

  const fieldToFocus = 'basenom_name'
  const columnVisibilityModel = {
    basefd: false,
    basehouse_id: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'baseHouseRoom'] })
  }
  if (!eventId) return null
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
      onRowSelectionModelChange={onRowSelectionModelChange}
    // isCellEditable={(params) => params.field !== 'basenom_mest'}
    />
  )
}
