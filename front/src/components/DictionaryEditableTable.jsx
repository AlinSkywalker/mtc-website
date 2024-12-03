import React from 'react'
import {
  DataGrid,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import { Grid2 } from '@mui/material'
import { DictionaryEditToolbar } from './DictionaryEditToolbar'



export const DictionaryEditableTable = (rows, setRows, rowModesModel, setRowModesModel, columns,processRowUpdate, fieldToFocus, columnVisibilityModel, 
  defaultDictionaryItem) => {
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  return (
      <Grid2 spacing={2} container flexDirection={'column'}>
        <Grid2 item size={12} sx={{height: `calc(100vh-250)`}}>
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
                  fieldToFocus={fieldToFocus}
                  defaultDictionaryItem={defaultDictionaryItem}
                />
              ),
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            columnVisibilityModel={columnVisibilityModel}
          />
        </Grid2>
      </Grid2>
  )
}
