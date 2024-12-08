import React from 'react'
import { useFetchBaseDictionaryList } from '../../queries/dictionary'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DistrictSelectMenu } from '../DistrictSelectMenu'
import { EditableTable } from '../EditableTable'
import { MultiValueSelectEditInputCell } from '../MultiValueSelectEditInputCell'
import * as Yup from 'yup'

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

export const BaseDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchBaseDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    // console.log('handleSaveNewItem')
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
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    return apiClient.post(`/api/baseDictionary/${id}`, postedData)
  }, [])

  const renderContractorMultiValueEditCell = (params) => {
    // console.log('params', params)
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
    // console.log('params', params)
    return (
      <DistrictSelectMenu {...params} dictionaryName='districtDictionary' nameField='base_rai' />
    )
  }

  const columns = [
    { field: 'base_name', headerName: 'Название', width: 350, editable: true },
    { field: 'base_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'base_adres', headerName: 'Сайт', width: 150, editable: true },
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

  const processRowUpdate = (newRow) => {
    let resultRow = newRow
    try {
      validationSchema.validateSync(newRow, { abortEarly: false })
      const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
      handleSave(newRow)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ['baseDictionary'] })
          const updatedRow = { ...newRow, isNew: false, error: false }
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
          resultRow = updatedRow
        })
        .catch((e) => {
          // ошибка с бэка - надо как то вывести, и оно видимо не сохранилось
          const errorRow = { ...newRow, error: true }
          setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
          resultRow = errorRow
          throw errorRow
        })
    } catch (e) {
      const errors = e.inner.map((item) => ({ path: item.path, message: item.message }))
      const errorRow = { ...newRow, error: true, errors }
      setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
      resultRow = errorRow
      throw errorRow
    }
    return resultRow
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
    />
  )
}
