import React from 'react'
import { useFetchBaseDictionaryList } from '../../../queries/dictionary'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DistrictSelectMenu } from '../../dataGridCell/DistrictSelectMenu'
import { EditableTable } from '../../EditableTable'
import { MultiValueSelectEditInputCell } from '../../dataGridCell/MultiValueSelectEditInputCell'
import * as Yup from 'yup'
import { multilineColumnType } from '../../dataGridCell/GridEditMultilineCell'

const defaultItem = {
  base_rai: '',
  rai_name: '',
  base_name: '',
  base_adres: '',
  base_desc: '',
  base_cont: '',
  cont_fio: '',
  base_sait: '',
  contr_id_list: [],
  contr_name_list: [],
}

const validationSchema = Yup.object({
  base_rai: Yup.string().required('Поле обязательно для заполнения'),
  base_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const BaseDictionaryTable = ({ onRowSelectionModelChange }) => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchBaseDictionaryList()

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    return apiClient.put('/api/baseDictionary', postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/baseDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['baseDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/baseDictionary/${id}`, postedData)
  }, [])

  const renderContractorMultiValueEditCell = (params) => {
    return (
      <MultiValueSelectEditInputCell
        {...params}
        dictionaryName='contractorDictionary'
        nameListField='contr_name_list'
        idListField='contr_id_list'
        displayNameField='cont_fio'
      />
    )
  }
  const renderDistrictSelectEditCell = (params) => {
    return (
      <DistrictSelectMenu {...params} dictionaryName='districtDictionary' nameField='base_rai' />
    )
  }

  const columns = [
    { field: 'base_name', headerName: 'Название', width: 350, editable: true },
    {
      field: 'base_desc',
      headerName: 'Описание',
      width: 350,
      editable: true,
      ...multilineColumnType,
    },
    { field: 'base_adres', headerName: 'Местоположение', width: 150, editable: true },
    { field: 'base_rai', headerName: 'base_rai', width: 0, editable: true },
    {
      field: 'cont_fio',
      headerName: 'cont_fio',
      width: 0,
      editable: true,
    },
    {
      field: 'base_cont',
      headerName: 'Контрагент',
      width: 350,
      editable: true,
      renderEditCell: renderContractorMultiValueEditCell,
      renderCell: (params) => {
        const displayValue = params.row.cont_fio
        return <>{displayValue}</>
      },
    },
    {
      field: 'rai_name',
      headerName: 'Район',
      width: 350,
      editable: true,
      renderEditCell: renderDistrictSelectEditCell,
    },
    { field: 'base_sait', headerName: 'Сайт', width: 150, editable: true },
    {
      field: 'contr_id_list',
      headerName: 'contr_id_list',
      width: 0,
      editable: true,
      renderEditCell: renderDistrictSelectEditCell,
      renderCell: () => {
        return <></>
      },
    },
    {
      field: 'contr_name_list',
      headerName: 'contr_name_list',
      width: 0,
      editable: true,
      renderEditCell: renderDistrictSelectEditCell,
      renderCell: () => {
        return <></>
      },
    },
    { field: 'region_name', headerName: 'region_name', width: 0, editable: true },
    { field: 'rai_reg', headerName: 'rai_reg', width: 0, editable: true },
  ]

  const fieldToFocus = 'base_name'
  const columnVisibilityModel = {
    base_rai: false,
    cont_fio: false,
    contr_name_list: false,
    contr_id_list: false,
    region_name: false,
    rai_reg: false,
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['baseDictionary'] })
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
      onRowSelectionModelChange={onRowSelectionModelChange}
      height={600}
    />
  )
}
