import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import { BaseDictionaryTable } from './tables/BaseDictionaryTable'
import { BaseHouseDictionaryTable } from './tables/BaseHouseDictionaryTable'
import { BaseHouseRoomDictionaryTable } from './tables/BaseHouseRoomDictionaryTable'

export const BaseDictionaryTab = () => {
  const [selectedBase, setSelectedBase] = useState()
  const [selectedBaseHouse, setSelectedBaseHouse] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    let newId = ''
    newRowSelectionModel.ids.forEach(item => {
      newId = item
    })
    setSelectedBase(newId)
    setSelectedBaseHouse()
  }
  const onHouseRowSelectionModelChange = (newRowSelectionModel) => {
    let newId = ''
    newRowSelectionModel.ids.forEach(item => {
      newId = item
    })
    setSelectedBaseHouse(newId)
  }
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid size={12}>
        <BaseDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid>
      <Grid size={4}>
        <BaseHouseDictionaryTable
          selectedBase={selectedBase}
          onRowSelectionModelChange={onHouseRowSelectionModelChange}
        />
      </Grid>
      <Grid size={8}>
        <BaseHouseRoomDictionaryTable
          selectedBase={selectedBase}
          selectedBaseHouse={selectedBaseHouse}
        />
      </Grid>
    </Grid>
  )
}
