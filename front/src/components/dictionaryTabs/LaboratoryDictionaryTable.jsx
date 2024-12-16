import React from 'react'
import { useFetchLaboratoryDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DistrictSelectMenu } from '../dataGridCell/DistrictSelectMenu'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { multilineColumnType } from '../dataGridCell/GridEditMultilineCell'

const defaultItem = {
  laba_rai: '',
  laba_desk: '',
  laba_name: '',
  rai_name: '',
}

const validationSchema = Yup.object({
  laba_rai: Yup.string().required('Поле обязательно для заполнения'),
  laba_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const LaboratoryDictionaryTable = ({ onRowSelectionModelChange }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchLaboratoryDictionaryList()

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put('/api/laboratoryDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/laboratoryDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/laboratoryDictionary/${id}`, postedData)
  }, [])

  const renderSelectEditCell = (params) => {
    return (
      <DistrictSelectMenu {...params} dictionaryName='districtDictionary' nameField='laba_rai' />
    )
  }

  const columns = [
    { field: 'laba_name', headerName: 'Название', width: 250, editable: true },
    {
      field: 'laba_desk',
      headerName: 'Описание',
      width: 350,
      editable: true,
      ...multilineColumnType,
    },
    { field: 'laba_rai', headerName: 'laba_rai', width: 0, editable: true },
    {
      field: 'rai_name',
      headerName: 'Район',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
    },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
  ]

  const fieldToFocus = 'laba_name'
  const columnVisibilityModel = {
    laba_rai: false,
    region_name: false,
    rai_reg: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
  }

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
      fullHeight={false}
      onRowSelectionModelChange={onRowSelectionModelChange}
    />
  )
}
