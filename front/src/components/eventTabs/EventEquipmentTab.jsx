import React from 'react'
import { useFetchEventEqipmentList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { Button, MenuItem, Select } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useFetchEquipmentTemplate, useFetchEquipmentTypeList } from '../../queries/equipment'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'

const defaultItem = {
  type: '',
  equip_name: '',
  quantity: 1,
}

const validationSchema = Yup.object({
  equip_id: Yup.string().required('Поле обязательно для заполнения'),
  quantity: Yup.number().required('Поле обязательно для заполнения'),
  type: Yup.string().required('Поле обязательно для заполнения'),
})

export const EventEquipmentTab = ({ eventId }) => {
  const readOnly = !useIsAdmin()
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEventEqipmentList(eventId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const { data: templateData } = useFetchEquipmentTemplate()

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data

    return apiClient.put(`/api/eventList/${eventId}/equipment`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/eventList/${eventId}/equipment/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'equipment'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data

    return apiClient.post(`/api/eventList/${eventId}/equipment/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='equipment_type'
        nameField='equip_id'
        hook={useFetchEquipmentTypeList}
      // secondarySource='equip_desc'
      />
    )
  }

  const renderEquipNameCell = (params) => {
    const value = `${params.row.equip_name}`
    if (params.row.equip_desc) {
      return (
        <>
          {value}
          <Tooltip title={params.row.equip_desc}>
            <IconButton sx={{ marginLeft: 1, color: red[500] }}>
              <InfoOutlineIcon fontSize='small' color='info' />
            </IconButton>
          </Tooltip>
        </>
      )
    }
    return value
  }

  const columns = [
    {
      field: 'type',
      headerName: 'Тип',
      width: 150,
      editable: !readOnly,
      type: 'singleSelect',
      valueOptions: ['Личное', 'Групповое'],
    },
    {
      field: 'equip_name',
      headerName: 'Название',
      width: 250,
      editable: !readOnly,
      renderCell: renderEquipNameCell,
      renderEditCell: renderSelectEditCell,
    },
    {
      field: 'quantity',
      headerName: 'Количество',
      width: 120,
      editable: !readOnly,
    },
    {
      field: 'equip_id',
      headerName: '',
      width: 0,
      editable: !readOnly,
    },
  ]
  const fieldToFocus = 'type'
  const columnVisibilityModel = {
    equip_id: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem

    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['event', eventId, 'equipment'] })
  }

  const [seleсtedTemplate, setSelectedTemplate] = React.useState('')
  const handleChangeTemplateSelect = (event) => {
    setSelectedTemplate(event.target.value)
  }

  const handelClickCopyTemplate = () => {
    apiClient
      .post(`/api/eventList/${eventId}/copyEquipmentTemplate`, {
        templateId: seleсtedTemplate,
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ['event', eventId, 'equipment'] })
      })
  }
  const additionalButton = (
    <>
      <Select sx={{ width: 300 }} onChange={handleChangeTemplateSelect} value={seleсtedTemplate}>
        {templateData?.map((item, index) => (
          <MenuItem
            key={index}
            value={item.id}
          >{`${item.template_name} (${item.template_desc || ''})`}</MenuItem>
        ))}
      </Select>
      <Button
        color='primary'
        // startIcon={seleсtedDepartment ? <AddIcon /> : <></>}
        onClick={handelClickCopyTemplate}
        disabled={readOnly || !seleсtedTemplate}
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
