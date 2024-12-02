import React from 'react'
import { useFetchLaboratoryDictionaryList } from '../queries/dictionary'
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { Grid2 } from '@mui/material'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'
import { SelectEditInputCell } from './SelectEditInputCell'

const defaultDictionaryItem = {
  laba_rai: '',
  laba_desk: '',
  laba_name: '',
  rai_name: '',
}

export const LaboratoryDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchLaboratoryDictionaryList()

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
    apiClient.put('/api/laboratoryDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/laboratoryDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.post(`/api/laboratoryDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['laboratoryDictionary'] })
    })
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='districtDictionary' nameField='rai_name' />
    )
  }

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={1}
              icon={<SaveIcon />}
              label='Сохранить'
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={2}
              icon={<CancelIcon />}
              label='Отменить'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ]
        }
        return [
          <GridActionsCellItem
            key={1}
            icon={<EditIcon />}
            label='Редактировать'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            key={2}
            icon={<DeleteIcon />}
            label='Удалить'
            onClick={handleDeleteItem(id)}
            color='inherit'
          />,
        ]
      },
    },
    { field: 'laba_name', headerName: 'Название', width: 350, editable: true },
    { field: 'laba_desk', headerName: 'Описание', width: 350, editable: true },
    { field: 'rai_name', headerName: 'rai_name', width: 0, editable: true },
    {
      field: 'laba_rai',
      headerName: 'Район',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
      // valueGetter: (value, row) => {
      //   return `${row.region_id}|${row.region_name}`
      // },
      renderCell: (params) => {
        const displayValue = params.row.rai_name
        return <>{displayValue}</>
      },
    },
  ]

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = (newRow) => {
    // console.log('processRowUpdate')
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    handleSave(newRow)
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  return (
    <>
      <Grid2 spacing={2} container flexDirection={'column'}>
        <Grid2 item size={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.log(error)}
            slots={{
              toolbar: () => (
                <DictionaryEditToolbar
                  setRows={setRows}
                  setRowModesModel={setRowModesModel}
                  fieldToFocus='city_name'
                  defaultDictionaryItem={defaultDictionaryItem}
                />
              ),
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            columnVisibilityModel={{
              rai_name: false,
            }}
          />
        </Grid2>
      </Grid2>
    </>
  )
}
