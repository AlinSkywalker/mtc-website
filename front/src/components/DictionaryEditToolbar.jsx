import React from 'react'
import { GridRowModes, Toolbar } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { Button, Grid } from '@mui/material'

export const DictionaryEditToolbar = (props) => {
  const {
    setRows,
    setRowModesModel,
    defaultItem,
    fieldToFocus,
    disabled = false,
    addButtonLabel,
  } = props

  const handleClick = () => {
    const id = crypto.randomUUID()
    setRows((oldRows) => [{ ...defaultItem, id, isNew: true }, ...oldRows])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: fieldToFocus },
    }))
  }

  return (
    <Toolbar>
      <Grid sx={{ flexGrow: 1 }}>
        <Button color='primary' startIcon={<AddIcon />} onClick={handleClick} disabled={disabled}>
          {addButtonLabel ? addButtonLabel : 'Добавить'}
        </Button>
      </Grid>
    </Toolbar>
  )
}
