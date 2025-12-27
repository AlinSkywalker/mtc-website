import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import { TemplateDictionaryTable } from './tables/TemplateDictionaryTable'
import { TemplateEquipDictionaryTable } from './tables/TemplateEquipDictionaryTable'

export const EquipmentTemplateTab = () => {
  const [selectedTemplate, setSelectedTemplate] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    let newId = ''
    newRowSelectionModel.ids.forEach((item) => {
      newId = item
    })
    setSelectedTemplate(newId)
  }
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid size={12}>
        <TemplateDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid>
      <Grid size={12}>
        <TemplateEquipDictionaryTable selectedTemplate={selectedTemplate} />
      </Grid>
    </Grid>
  )
}
