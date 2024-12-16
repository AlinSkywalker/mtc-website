import React from 'react'
import { useFetchEventDepartmentList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMemberList } from '../../queries/member'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'

const defaultItem = {
  depart_tip: '',
  depart_name: '',
  depart_dates: '',
  depart_datef: '',
  depart_inst: '',
  inst_fio: '',
}

const validationSchema = Yup.object({
  depart_tip: Yup.string().required('Поле обязательно для заполнения'),
  depart_name: Yup.string().required('Поле обязательно для заполнения'),
  depart_dates: Yup.string().required('Поле обязательно для заполнения'),
  depart_datef: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventDepartmentTable = ({ eventId, onRowSelectionModelChange }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventDepartmentList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/department`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/department/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'department'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/department/${id}`, postedData)
  }, [])

  const renderInstructorSelectEditCell = (params) => {
    const hookParams = {
      possibleRole: 'instructor',
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='depart_inst'
        hook={useFetchMemberList}
        hookParams={hookParams}
        secondarySource='alpinstr'
      />
    )
  }

  const columns = [
    {
      field: 'depart_tip',
      headerName: 'Тип',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['НП1', 'НП2', 'СП1', 'СП2', 'СС', 'СМ'],
    },
    { field: 'depart_name', headerName: 'Позывной', width: 150, editable: true },
    { field: 'depart_dates', ...dateColumnType, headerName: 'Старт', width: 120, editable: true },
    {
      field: 'depart_datef',
      ...dateColumnType,
      headerName: 'Финиш',
      width: 120,
      editable: true,
    },
    {
      field: 'inst_fio',
      headerName: 'Инструктор',
      width: 200,
      renderEditCell: renderInstructorSelectEditCell,
      editable: true,
    },
    { field: 'depart_inst', headerName: 'depart_inst', width: 0, editable: true },
  ]

  const fieldToFocus = 'depart_tip'
  const columnVisibilityModel = {
    depart_inst: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'department'] })
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
    />
  )
}
