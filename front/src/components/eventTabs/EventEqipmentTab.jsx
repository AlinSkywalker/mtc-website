import React from 'react'
import {
  useFetchEvent,
  useFetchEventEqipmentList,
  useFetchEventMemberList,
} from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMemberList } from '../../queries/member'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { Button, Link, MenuItem, Select } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GridEditInputCell } from '@mui/x-data-grid'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'
import { fileColumnType } from '../dataGridCell/GridEditFileCell'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useFetchEqipmentTemplate } from '../../queries/dictionary'

const defaultItem = {
  eventmemb_memb: '',
  eventmemb_nstrah: 0,
  eventmemb_nmed: 0,
  eventmemb_dates: '',
  eventmemb_datef: '',
  fio: '',
  eventmemb_gen: '',
  eventmemb_nom: '',
  ventmemb_pred: '',
  eventmemb_opl: '',
  eventmemb_role: 'Участник',
  alerts: [],
}

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventEqipmentTab = ({ eventId }) => {
  const readOnly = !useIsAdmin()
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventEqipmentList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  const navigate = useNavigate()

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const { data: templateData } = useFetchEqipmentTemplate()

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data

    return apiClient.put(`/api/eventList/${eventId}/eqipment`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/eqipment/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'eqipment'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data

    return apiClient.post(`/api/eventList/${eventId}/eqipment/${id}`, postedData)
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
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='members'
        nameField='eventmemb_memb'
        hook={useFetchMemberList}
        pickMap={pickMap}
        secondarySource='alprazr'
        secondarySourceArray={['alprazr', 'skali', 'ledu']}
      />
    )
  }
  const handleClickName = (id) => () => {
    navigate(`/crm/member/${id}`)
  }
  const renderLink = (params) => {
    const link = params.value ?? ''
    if (readOnly) return link
    return (
      <Link onClick={handleClickName(params.row.eventmemb_memb)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
  }

  const columns = [
    {
      field: 'fio',
      headerName: 'ФИО',
      width: 250,
      renderCell: renderLink,
      renderEditCell: renderSelectEditCell,
      editable: !readOnly,
    },
    {
      field: 'eventmemb_dates',
      ...dateColumnType,
      headerName: 'Дата заезда',
      width: 120,
      editable: !readOnly,
    },
    {
      field: 'eventmemb_datef',
      ...dateColumnType,
      headerName: 'Дата выезда',
      width: 120,
      editable: !readOnly,
      minDate: 'eventmemb_dates',
    },
    { field: 'eventmemb_memb', headerName: 'eventmemb_memb', width: 0, editable: !readOnly },
    {
      field: 'eventmemb_nstrah',
      headerName: 'Страховка',
      width: 100,
      editable: !readOnly,
      ...checkboxColumnType,
    },
    {
      field: 'strah_file_name',
      headerName: 'Страховка',
      width: 200,
      editable: !readOnly,
      downloadApiPath: `/api/eventList/${eventId}/members/files`,
      filePathField: 'strah_file_path',
      fileNameField: 'strah_file_name',
      fileCol: 'strah_file',
      ...fileColumnType,
    },
    {
      field: 'eventmemb_nmed',
      headerName: 'Справка',
      width: 100,
      editable: !readOnly,
      ...checkboxColumnType,
    },
    {
      field: 'med_file_name',
      headerName: 'Справка',
      width: 200,
      editable: !readOnly,
      downloadApiPath: `/api/eventList/${eventId}/members/files`,
      filePathField: 'med_file_path',
      fileNameField: 'med_file_name',
      fileCol: 'med_file',
      ...fileColumnType,
    },
    {
      field: 'eventmemb_role',
      headerName: 'Роль',
      width: 100,
      editable: !readOnly,
      type: 'singleSelect',
      valueOptions: ['Участник', 'Инструктор', 'Стажёр', 'Турист', 'Спортсмен'],
    },
    {
      field: 'eventmemb_pred',
      headerName: 'Оплата',
      width: 100,
      editable: !readOnly,
      type: 'number',
    },
    {
      field: 'eventmemb_gen',
      headerName: 'Проживание по полу',
      width: 100,
      editable: !readOnly,
      ...checkboxColumnType,
    },
    {
      field: 'gender',
      headerName: 'Пол',
      width: 80,
      editable: !readOnly,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'tel_1',
      headerName: 'Телефон',
      width: 150,
      editable: !readOnly,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'memb_email',
      headerName: 'email',
      width: 150,
      editable: !readOnly,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'ball',
      headerName: 'Разряд',
      width: 80,
      editable: false,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'med_file',
      headerName: 'Файл',
      width: 0,
      editable: !readOnly,
    },
    {
      field: 'strah_file',
      headerName: 'Файл',
      width: 0,
      editable: !readOnly,
    },
    {
      field: 'med_file_path',
      headerName: '',
      width: 0,
      editable: !readOnly,
    },
    {
      field: 'strah_file_path',
      headerName: '',
      width: 0,
      editable: !readOnly,
    },
  ]
  const fieldToFocus = 'fio'
  const columnVisibilityModel = {
    eventmemb_memb: false,
    med_file: false,
    strah_file: false,
    memb_email: false,
    tel_1: false,
    eventmemb_gen: false,
    eventmemb_pred: false,
    eventmemb_nstrah: false,
    eventmemb_nmed: false,
    med_file_name: false,
    med_file_path: false,
    strah_file_name: false,
    strah_file_path: false,
    alerts: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem

    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'member'] })
  }

  const [seleсtedTemplate, setSelectedTemplate] = React.useState('')
  const handleChangeTemplateSelect = (event) => {
    setSelectedTemplate(event.target.value)
  }

  const handelClickCopyTemplate = () => { }
  const additionalButton = (
    <>
      <Select sx={{ width: 300 }} onChange={handleChangeTemplateSelect} value={seleсtedTemplate}>
        {templateData?.map((item, index) => (
          <MenuItem
            key={index}
            value={item.id}
          >{`${item.depart_tip} ${item.depart_name} (${item.depart_dates} - ${item.depart_datef})`}</MenuItem>
        ))}
      </Select>
      <Button
        color='primary'
        // startIcon={seleсtedDepartment ? <AddIcon /> : <></>}
        onClick={handelClickCopyTemplate}
        disabled={readOnly}
      >
        Скопировать шаблон
      </Button>
    </>
  )
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
        params.field !== 'fio' || (params.row.isNew && params.field == 'fio')
      }
      readOnly={readOnly}
      additionalButton={additionalButton}
    />
  )
}
