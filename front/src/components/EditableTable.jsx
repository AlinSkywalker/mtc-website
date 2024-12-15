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
  onRowSelectionModelChange,
  addButtonDisabled,
  isCellEditable,
  isRowEditable = () => true,
  addButtonLabel,
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
  const handleProcessRowUpdate = async (newRow) => {
    let resultRow = newRow
    try {
      await processRowUpdate(newRow)

      const updatedRow = { ...newRow, isNew: false, error: false, errors: [] }
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
      resultRow = updatedRow
    } catch (e) {
      let errors = null
      if (e.inner) {
        errors = e.inner.map((item) => ({ path: item.path, message: item.message }))
      }
      const errorRow = { ...newRow, error: true, errors }
      setRows(rows.map((row) => (row.id === newRow.id ? errorRow : row)))
      throw errorRow
    }
    return resultRow
  }

  const handleProcessRowUpdateError = (error) => {
    console.log('error', error)
  }
  const getActions = (id) => {
    {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
      const row = rows.find((row) => row.id === id)
      const isNew = row?.isNew
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
          disabled={!isRowEditable(row)}
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
      width: 70,
      cellClassName: 'actions',
      getActions: ({ id }) => getActions(id),
    },
    ...columns,
  ]
  // console.log('fullHeight', fullHeight)
  const tableHeight = fullHeight ? `calc(100vh - 150px)` : 400
  const disabled = addButtonDisabled
  return (
    <Grid2 spacing={2} container flexDirection={'column'}>
      <Grid2 item size={12} sx={{ height: tableHeight }}>
        <DataGrid
          rows={rows}
          columns={tableColumns}
          loading={isLoading}
          editMode='row'
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onRowSelectionModelChange={onRowSelectionModelChange}
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
                  disabled={disabled}
                  addButtonLabel={addButtonLabel}
                />
              )
            },
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, disabled, fieldToFocus, defaultItem },
          }}
          columnVisibilityModel={columnVisibilityModel}
          getCellClassName={(params) => {
            if (params.row.error) {
              const fieldHasError = params.row.errors?.find((item) => item.path === params.field)
              if (fieldHasError) return 'errorField'
              // if(params.row.errors)
            }
          }}
          columnHeaderHeight={36}
          rowHeight={42}
          isCellEditable={isCellEditable}
        />
      </Grid2>
    </Grid2>
  )
}
