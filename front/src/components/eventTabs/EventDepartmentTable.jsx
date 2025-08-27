import React from 'react'
import { useFetchEventDepartmentList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMemberList } from '../../queries/member'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'

const validationSchema = Yup.object({
  depart_tip: Yup.string().required('Поле обязательно для заполнения'),
  depart_name: Yup.string().required('Поле обязательно для заполнения'),
  depart_dates: Yup.string()
    .required('Поле обязательно для заполнения')
    .test({
      name: '1',
      exclusive: false,
      params: {},
      message: 'Дата начала не может быть больше даты окончания',
      test: (value, context) => new Date(value) <= new Date(context.parent.depart_datef),
    }),
  depart_datef: Yup.string()
    .required('Поле обязательно для заполнения')
    .test({
      name: '2',
      exclusive: false,
      params: {},
      message: 'Дата окончания не может быть меньше даты начала',
      test: (value, context) => new Date(value) >= new Date(context.parent.depart_dates),
    }),
})

export const EventDepartmentTable = ({ eventId, eventStart, eventFinish, readOnly }) => {
  const defaultItem = {
    depart_tip: '',
    depart_name: '',
    depart_dates: '',
    depart_datef: '',
    depart_inst: '',
    inst_fio: '',
    event_start: eventStart,
    event_finish: eventFinish,
  }
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
      valueOptions: ['НП', 'СП', 'СС', 'СМ', 'ХЗ'],
    },
    { field: 'depart_name', headerName: 'Позывной', width: 150, editable: true },
    {
      field: 'depart_dates',
      ...dateColumnType,
      headerName: 'Старт',
      width: 120,
      editable: true,
      minDate: 'event_start',
    },
    {
      field: 'depart_datef',
      ...dateColumnType,
      headerName: 'Финиш',
      width: 120,
      editable: true,
      minDate: 'depart_dates',
    },
    {
      field: 'inst_fio',
      headerName: 'Инструктор/Тренер',
      width: 300,
      renderEditCell: renderInstructorSelectEditCell,
      editable: true,
    },
    { field: 'depart_inst', headerName: 'depart_inst', width: 0, editable: true },
  ]

  const fieldToFocus = 'depart_tip'
  const columnVisibilityModel = {
    depart_inst: false,
  }

  const processRowUpdate = async (newRow, oldRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    if (
      oldRow?.depart_dates !== newRow.depart_dates ||
      oldRow?.depart_datef !== newRow.depart_datef
    ) {
      newRow = { ...newRow, isDatesChanged: true }
    }
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
      height='calc(100vh - 150px)'
      readOnly={readOnly}
    />
  )
}
