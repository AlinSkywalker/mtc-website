import React from 'react'
import { GridRowModes, Toolbar } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { Button, Grid } from '@mui/material'
import { v4 } from 'uuid'

export const DictionaryEditToolbar = (props) => {
  const {
    setRows,
    setRowModesModel,
    defaultItem,
    fieldToFocus,
    disabled = false,
    addButtonLabel,
    additionalButton,
    paginationModel,
    readOnly,
  } = props

  const handleClick = () => {
    const id = v4()
    const { pageSize, page } = paginationModel
    const newIndex = page * pageSize
    setRows((oldRows) => {
      const newRows = [...oldRows]
      newRows.splice(newIndex, 0, { ...defaultItem, id, isNew: true })
      return newRows
    })
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: fieldToFocus },
    }))
  }

  return (
    <Toolbar>
      <Grid sx={{ flexGrow: 1 }}>
        {!readOnly && (
          <Button color='primary' startIcon={<AddIcon />} onClick={handleClick} disabled={disabled}>
            {addButtonLabel ? addButtonLabel : 'Добавить'}
          </Button>
        )}
        {additionalButton}
      </Grid>
    </Toolbar>
  )
}
