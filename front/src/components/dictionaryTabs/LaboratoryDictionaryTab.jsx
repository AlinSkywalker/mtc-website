import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import { LaboratoryDictionaryTable } from './LaboratoryDictionaryTable'
import { LaboratoryRouteDictionaryTable } from './tables/LaboratoryRouteDictionaryTable'

export const LaboratoryDictionaryTab = () => {
  const [selectedLaboratory, setSelectedLaboratory] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    let newId = ''
    newRowSelectionModel.ids.forEach(item => {
      newId = item
    })
    setSelectedLaboratory(newId)
  }
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid size={12}>
        <LaboratoryDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid>
      <Grid size={12}>
        <LaboratoryRouteDictionaryTable selectedLaboratory={selectedLaboratory} />
      </Grid>
    </Grid>
  )
}
