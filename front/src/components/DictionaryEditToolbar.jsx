import React from 'react'
import { randomId } from '@mui/x-data-grid-generator'
import { GridToolbarContainer, GridRowModes } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'

export function DictionaryEditToolbar(props) {
  const { setRows, setRowModesModel, defaultDictionaryItem, fieldToFocus } = props

  const handleClick = () => {
    const id = randomId()
    setRows((oldRows) => [{ ...defaultDictionaryItem, id, isNew: true }, ...oldRows])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: fieldToFocus },
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
        Добавить
      </Button>
    </GridToolbarContainer>
  )
}
