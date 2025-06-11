import React, { useState } from 'react'
import {
  DataGrid,
  GridRowEditStopReasons,
  GridRowModes,
  GridRowEditStartReasons,
} from '@mui/x-data-grid'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import { GridActionsCellItem } from '@mui/x-data-grid'
import './EditableTableStyles.css'
import { useSnackbar } from 'notistack'
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

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
  height,
  onRowSelectionModelChange,
  addButtonDisabled,
  isCellEditable,
  isRowEditable = () => true,
  addButtonLabel,
  className,
  showPagination = true,
}) => {
  const [deletedItem, setDeletedItem] = useState('')
  const isSomeNewRow = rows?.some((item) => item.isNew)
  const isSomeRowEditing = Object.values(rowModesModel).some(
    (item) => item.mode == GridRowModes.Edit,
  )
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const handleRowEditStart = (params, event) => {
    if (params.reason === GridRowEditStartReasons.cellDoubleClick) {
      event.defaultMuiPrevented = true
    }
    if (isSomeNewRow) {
      event.defaultMuiPrevented = true
    }
  }

  const handleRowEditStop = (params, event) => {
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
    let snackbarText = 'Произошла ошибка при отправке на сервер'
    if (error?.errors && error?.errors?.length !== 0) snackbarText = 'Ошибка валидации'
    enqueueSnackbar(snackbarText, {
      variant: 'error',
      autoHideDuration: 5000,
    })
  }

  const handleDeleteClick = (id) => () => {
    setDeletedItem(id)
  }
  const handleNo = () => {
    setDeletedItem('')
  }
  const handleYes = async () => {
    handleDeleteItem(deletedItem)()
    setDeletedItem('')
  }
  const renderConfirmDialog = () => {
    if (deletedItem === '') {
      return null
    }
    return (
      <Dialog maxWidth='xs' open={!!deletedItem}>
        <DialogTitle>Вы уверены?</DialogTitle>
        <DialogContent dividers>{`Вы уверены, что хотите удалить запись?`}</DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>Нет</Button>
          <Button onClick={handleYes}>Да</Button>
        </DialogActions>
      </Dialog>
    )
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
          disabled={!isRowEditable(row) || isSomeNewRow || isSomeRowEditing}
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
      } else if (handleDeleteItem) {
        actions.push(
          <GridActionsCellItem
            key={2}
            icon={<DeleteIcon />}
            label='Удалить'
            onClick={handleDeleteClick(id)}
            color='inherit'
            disabled={(isSomeNewRow && !isNew) || isSomeRowEditing}
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
  const tableHeight = height ? height : `calc(100vh - 150px)`
  const disabled = addButtonDisabled
  return (
    <Grid spacing={2} container flexDirection={'column'}>
      {renderConfirmDialog()}
      <Grid size={12} sx={{ height: tableHeight }}>
        <DataGrid
          // disableColumnSorting
          className={`editableTable ${className}  ${showPagination ? '' : 'withoutPagination'}`}
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
          showToolbar
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
                  disabled={disabled || isSomeNewRow || isSomeRowEditing}
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
            return ''
          }}
          columnHeaderHeight={36}
          rowHeight={42}
          isCellEditable={isCellEditable}
          disableColumnMenu
        />
      </Grid>
    </Grid>
  )
}
