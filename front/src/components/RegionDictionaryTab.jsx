import React from 'react'
import { useFetchRegionDictionaryList } from '../queries/dictionary'
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { Grid2 } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import apiClient from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'

const defaultDictionaryItem = {
  region_desk: '',
  region_name: '',
}
export const RegionDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchRegionDictionaryList()

  const [rows, setRows] = React.useState(data)
  console.log('rows', rows)
  const [rowModesModel, setRowModesModel] = React.useState({})
  console.log('rowModesModel', rowModesModel)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    // console.log('handleSaveNewItem')
    apiClient
      .put('/api/regionDictionary', { desc: data.region_desk, name: data.region_name })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
      })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/regionDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
    })
  }

  const handleSaveEditedItem = (data) => {
    // console.log('handleSaveEditedItem')
    apiClient
      .post(`/api/regionDictionary/${data.id}`, {
        desc: data.region_desk,
        name: data.region_name,
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ['regionDictionary'] })
      })
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
    {
      field: 'region_name',
      headerName: 'Название',
      width: 350,
      editable: true,
    },
    { field: 'region_desk', headerName: 'Описание', width: 450, editable: true },
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

  // if (isLoading) return null
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
                  fieldToFocus='region_name'
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
