import React from 'react'
import { useFetchLaboratoryRouteDictionaryList } from '../../../queries/dictionary'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../../EditableTable'
import * as Yup from 'yup'
import { multilineColumnType } from '../../dataGridCell/GridEditMultilineCell'
import { SelectEditInputCell } from '../../dataGridCell/SelectEditInputCell'
import {
  useFetchEquipmentTemplateEquip,
  useFetchEquipmentTypeList,
} from '../../../queries/equipment'
import { GridEditInputCell } from '@mui/x-data-grid'

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

export const TemplateEquipDictionaryTable = ({ selectedTemplate }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchEquipmentTemplateEquip(selectedTemplate)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/dictionary/equipmentTemplate/${selectedTemplate}/equip`, {
      ...postedData,
      labatr_lab: selectedTemplate,
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient
      .delete(`/api/dictionary/equipmentTemplate/${selectedTemplate}/equip/${id}`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['equipmentTemplateEquipDictionary', selectedTemplate],
        })
      })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(
      `/api/dictionary/equipmentTemplate/${selectedTemplate}/equip/${id}`,
      postedData,
    )
  }, [])

  const renderSelectEditCell = (params) => {
    const pickMap = {
      equip_type: 'equip_type',
    }
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='equipment_type'
        nameField='equip_id'
        hook={useFetchEquipmentTypeList}
        pickMap={pickMap}
      // secondarySource='equip_desc'
      />
    )
  }

  const columns = [
    {
      field: 'type',
      headerName: 'Тип',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Личное', 'Групповое'],
    },
    {
      field: 'equip_type',
      headerName: 'Тип',
      width: 120,
      editable: true,
      renderEditCell: (props) => (
        <GridEditInputCell {...props} disabled className={'roTableInput'} />
      ),
    },
    {
      field: 'equip_name',
      headerName: 'Название',
      width: 250,
      editable: true,
      // renderCell: renderEquipNameCell,
      renderEditCell: renderSelectEditCell,
    },
    {
      field: 'quantity',
      headerName: 'Количество',
      width: 120,
      editable: true,
    },
    {
      field: 'equip_id',
      headerName: '',
      width: 0,
      editable: true,
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
    queryClient.invalidateQueries({
      queryKey: ['equipmentTemplateEquipDictionary', selectedTemplate],
    })
  }

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
        height={600}
      />
    </>
  )
}
