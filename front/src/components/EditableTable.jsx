import React from 'react'
import {
  DataGrid,
  GridRowEditStopReasons,
  GridRowModes,
  GridRowEditStartReasons,
} from '@mui/x-data-grid'
import { Grid2, ThemeProvider } from '@mui/material'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { GridActionsCellItem } from '@mui/x-data-grid'
import './EditableTableStyles.css'
import theme from '../api/theme'

export const EditableTable = ({
  rows,
  setRows,
  rowModesModel,
  setRowModesModel,
  columns,
  processRowUpdate,
  fieldToFocus,
  columnVisibilityModel,
  defaultItem,
  isLoading,
  handleDeleteItem,
  toolbar,
  fullHeight = true,
}) => {
  const handleRowEditStart = (params, event) => {
    // console.log('handleRowEditStart', params, event)
    if (params.reason === GridRowEditStartReasons.cellDoubleClick) {
      // console.log('rowModesModel', rowModesModel)
      event.defaultMuiPrevented = true
    }
  }

  const handleRowEditStop = (params, event) => {
    // console.log('handleRowEditStop', params, event)
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
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
  const handleProcessRowUpdateError = (error) => {
    console.log('error', error)
  }
  const getActions = (id) => {
    {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
      const isNew = rows.find((row) => row.id === id)?.isNew
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
      const actions = [
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          label='Редактировать'
          className='textPrimary'
          onClick={handleEditClick(id)}
          color='inherit'
        />,
      ]
      if (isNew) {
        actions.push(
          <GridActionsCellItem
            key={2}
            icon={<CancelIcon />}
            label='Отменить'
            className='textPrimary'
            onClick={handleCancelClick(id)}
            color='inherit'
          />,
        )
      } else {
        actions.push(
          <GridActionsCellItem
            key={2}
            icon={<DeleteIcon />}
            label='Удалить'
            onClick={handleDeleteItem(id)}
            color='inherit'
          />,
        )
      }
      return actions
    }
  }
  const tableColumns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => getActions(id),
    },
    ...columns,
  ]
  // console.log('columns', tableColumns)
  return (
    <Grid2 spacing={2} container flexDirection={'column'}>
      <Grid2 item size={12} sx={{ height: fullHeight ? `calc(100vh - 150px)` : 600 }}>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={rows}
            columns={tableColumns}
            loading={isLoading}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            slots={{
              toolbar: () => {
                return toolbar ? (
                  toolbar
                ) : (
                  <DictionaryEditToolbar
                    setRows={setRows}
                    setRowModesModel={setRowModesModel}
                    fieldToFocus={fieldToFocus}
                    defaultItem={defaultItem}
                  />
                )
              },
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            columnVisibilityModel={columnVisibilityModel}
            getCellClassName={(params) => {
              if (params.row.error) {
                const fieldHasError = params.row.errors.find((item) => item.path === params.field)
                if (fieldHasError) return 'errorField'
                // if(params.row.errors)
              }
            }}
            columnHeaderHeight={36}
            rowHeight={42}
          />
        </ThemeProvider>
      </Grid2>
    </Grid2>
  )
}
