import React, { useState } from 'react'

import { Grid2 } from '@mui/material'
import { LaboratoryDictionaryTable } from './LaboratoryDictionaryTable'
import { LaboratoryRouteDictionaryTable } from './LaboratoryRouteDictionaryTable'

export const LaboratoryDictionaryTab = ({ eventId }) => {
  const [selectedLaboratory, setSelectedLaboratory] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    // console.log('newRowSelectionModel', newRowSelectionModel)
    setSelectedLaboratory(newRowSelectionModel[0])
  }
  return (
    <Grid2 container spacing={2} sx={{ width: '100%' }}>
      <Grid2 item size={12}>
        <LaboratoryDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid2>
      <Grid2 item size={12}>
        <LaboratoryRouteDictionaryTable selectedLaboratory={selectedLaboratory} />
      </Grid2>
    </Grid2>
  )
}
