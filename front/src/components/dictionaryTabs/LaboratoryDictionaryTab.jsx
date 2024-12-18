import React, { useState } from 'react'

import Grid from '@mui/material/Grid2'
import { LaboratoryDictionaryTable } from './LaboratoryDictionaryTable'
import { LaboratoryRouteDictionaryTable } from './LaboratoryRouteDictionaryTable'

export const LaboratoryDictionaryTab = () => {
  const [selectedLaboratory, setSelectedLaboratory] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedLaboratory(newRowSelectionModel[0])
  }
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid item size={12}>
        <LaboratoryDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid>
      <Grid item size={12}>
        <LaboratoryRouteDictionaryTable selectedLaboratory={selectedLaboratory} />
      </Grid>
    </Grid>
  )
}
