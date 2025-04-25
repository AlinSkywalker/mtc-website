import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import { BaseDictionaryTable } from './BaseDictionaryTable'
import { BaseHouseDictionaryTable } from './BaseHouseDictionaryTable'
import { BaseHouseRoomDictionaryTable } from './BaseHouseRoomDictionaryTable'

export const BaseDictionaryTab = () => {
  const [selectedBase, setSelectedBase] = useState()
  const [selectedBaseHouse, setSelectedBaseHouse] = useState()

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedBase(newRowSelectionModel[0])
    setSelectedBaseHouse()
  }
  const onHouseRowSelectionModelChange = (newRowSelectionModel) => {
    setSelectedBaseHouse(newRowSelectionModel[0])
  }
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid item size={12}>
        <BaseDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid>
      <Grid item size={4}>
        <BaseHouseDictionaryTable
          selectedBase={selectedBase}
          onRowSelectionModelChange={onHouseRowSelectionModelChange}
        />
      </Grid>
      <Grid item size={8}>
        <BaseHouseRoomDictionaryTable
          selectedBase={selectedBase}
          selectedBaseHouse={selectedBaseHouse}
        />
      </Grid>
    </Grid>
  )
}
