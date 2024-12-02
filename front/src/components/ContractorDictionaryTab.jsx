import React from 'react'
import { useFetchContractorDictionaryList } from '../queries/dictionary'
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

const defaultDictionaryItem = {
  cont_fio: '',
  cont_desc: '',
  cont_email: '',
  cont_tel3: '',
  cont_tel2: '',
  cont_tel1: '',
}

export const ContractorDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchContractorDictionaryList()

  const [rows, setRows] = React.useState(data)
  // console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    //console.log('handleSaveNewItem')
    const { id, isNew, ...postedData } = data
    apiClient.put('/api/contractorDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/contractorDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    //console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    apiClient.post(`/api/contractorDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['contractorDictionary'] })
    })
  }, [])

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
    { field: 'cont_fio', headerName: 'ФИО', width: 350, editable: true },
    { field: 'cont_desc', headerName: 'Описание', width: 350, editable: true },
    { field: 'cont_email', headerName: 'Email', width: 150, editable: true },
    { field: 'cont_tel1', headerName: 'Телефон 1', width: 150, editable: true },
    { field: 'cont_tel2', headerName: 'Телефон 2', width: 150, editable: true },
    { field: 'cont_tel3', headerName: 'Телефон 3', width: 150, editable: true },
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
    //console.log('processRowUpdate')
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
                  fieldToFocus='cont_fio'
                  defaultDictionaryItem={defaultDictionaryItem}
                />
              ),
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
        </Grid2>
      </Grid2>
    </>
  )
}
