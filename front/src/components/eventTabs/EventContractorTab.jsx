import React from 'react'
import { useFetchEventContractorList, useFetchContractorForEvent } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'

const defaultItem = {}

const validationSchema = Yup.object({
  cont_fio: Yup.string().required('Поле обязательно для заполнения'),
  tarif: Yup.string().required('Поле обязательно для заполнения'),
  count: Yup.string().required('Поле обязательно для заполнения'),
  transfer: Yup.string().required('Поле обязательно для заполнения'),
  residence: Yup.string().required('Поле обязательно для заполнения'),
  service_type: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventContractorTab = ({ eventId }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventContractorList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/eventList/${eventId}/contractor`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/contractor/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'contractor'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/eventList/${eventId}/contractor/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    const pickMap = {
      gender: 'gender',
      tel_1: 'tel_1',
      memb_email: 'memb_email',
      size_cloth: 'size_cloth',
      size_shoe: 'size_shoe',
      name_city: 'name_city',
    }
    const hookParams = {
      eventId,
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='contractorDictionary'
        nameField='contractor'
        hook={useFetchContractorForEvent}
        // pickMap={pickMap}
        secondarySource='cont_desc'
        // secondarySourceArray={['alprazr', 'skali', 'ledu']}
        hookParams={hookParams}
      />
    )
  }

  const columns = [
    {
      field: 'cont_fio',
      headerName: 'ФИО контрагента',
      width: 250,
      // renderCell: renderLink,
      renderEditCell: renderSelectEditCell,
      editable: true,
    },
    {
      field: 'date_start',
      ...dateColumnType,
      headerName: 'Начало',
      width: 120,
      editable: true,
    },
    {
      field: 'date_end',
      ...dateColumnType,
      headerName: 'Окончание',
      width: 120,
      editable: true,
      minDate: 'date_start',
    },
    { field: 'contractor', headerName: 'contractor', width: 0, editable: true },
    {
      field: 'service_type',
      headerName: 'Вид услуги',
      width: 100,
      editable: true,
    },
    {
      field: 'tarif',
      headerName: 'Тариф',
      width: 100,
      editable: true,
    },
    {
      field: 'count',
      headerName: 'Раз',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'transfer',
      headerName: 'Трансфер',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'residence',
      headerName: 'Проживание',
      width: 100,
      editable: true,
      type: 'number',
    },
    // {
    //   field: 'gender',
    //   headerName: 'Пол',
    //   width: 80,
    //   editable: true,
    //   renderEditCell: (props) => (
    //     <GridEditInputCell {...props} disabled className={'roTableInput'} />
    //   ),
    // },
    // {
    //   field: 'tel_1',
    //   headerName: 'Телефон',
    //   width: 150,
    //   editable: true,
    //   renderEditCell: (props) => (
    //     <GridEditInputCell {...props} disabled className={'roTableInput'} />
    //   ),
    // },
    // {
    //   field: 'memb_email',
    //   headerName: 'email',
    //   width: 150,
    //   editable: true,
    //   renderEditCell: (props) => (
    //     <GridEditInputCell {...props} disabled className={'roTableInput'} />
    //   ),
    // },
  ]
  const fieldToFocus = 'cont_fio'
  const columnVisibilityModel = {
    contractor: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'contractor'] })
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
      isCellEditable={(params) =>
        params.field !== 'cont_fio' || (params.row.isNew && params.field == 'cont_fio')
      }
    />
  )
}
