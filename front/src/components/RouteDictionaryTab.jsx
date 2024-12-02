import React from 'react'
import { useFetchRouteDictionaryList } from '../queries/dictionary'
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
  rout_mount: '',
  rout_desc: '',
  rout_per: '',
  rout_sup: '',
  rout_tip: '',
  rout_comp: '',
  rout_name: '',
  mount_name: '',
}

export const RouteDictionaryTab = () => {
  const queryClient = useQueryClient()
  const { isLoading, data } = useFetchRouteDictionaryList()

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
    apiClient.put('/api/routeDictionary', postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/routeDictionary/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    // console.log('handleSaveEditedItem', data)
    const { id, isNew, ...postedData } = data
    // postedData['rai_reg'] = postedData['rai_reg'].split('|')[0]
    apiClient.post(`/api/routeDictionary/${id}`, postedData).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['routeDictionary'] })
    })
  }, [])

  const renderSelectEditCell = (params) => {
    // console.log('params', params)
    return (
      <SelectEditInputCell {...params} dictionaryName='summitDictionary' nameField='mount_name' />
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
    { field: 'rout_name', headerName: 'Название', width: 350, editable: true },
    {
      field: 'rout_comp',
      headerName: 'Сложность',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['1Б', '2А', '2Б', '3А', '3Б', '4А', '4Б', '5А', '5Б', '6А', '6Б'],
    },
    {
      field: 'rout_tip',
      headerName: 'Характер',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['ск', 'к', 'лс'],
    },
    { field: 'rout_sup', headerName: 'Руководитель', width: 350, editable: true },
    { field: 'rout_per', headerName: 'Год прохождения', width: 100, editable: true },
    { field: 'rout_desc', headerName: 'Описание', width: 150, editable: true },
    { field: 'mount_name', headerName: 'mount_name', width: 0, editable: true },
    {
      field: 'rout_mount',
      headerName: 'Вершина',
      width: 350,
      editable: true,
      renderEditCell: renderSelectEditCell,
      // valueGetter: (value, row) => {
      //   return `${row.region_id}|${row.region_name}`
      // },
      renderCell: (params) => {
        const displayValue = params.row.mount_name
        return <>{displayValue}</>
      },
    },
  ]
  // rout_mount: '',
  // rout_desc: '',
  // rout_per: '',
  // rout_sup: '',
  // rout_tip: '',
  // rout_comp: '',
  // rout_name: '',
  // mount_name: '',

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
                  fieldToFocus='rout_name'
                  defaultDictionaryItem={defaultDictionaryItem}
                />
              ),
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            columnVisibilityModel={{
              mount_name: false,
            }}
          />
        </Grid2>
      </Grid2>
    </>
  )
}
