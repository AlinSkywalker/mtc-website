import React, { useState } from 'react'

import { Grid2 } from '@mui/material'
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
    <Grid2 container spacing={2} sx={{ width: '100%' }}>
      <Grid2 item size={12}>
        <BaseDictionaryTable onRowSelectionModelChange={onRowSelectionModelChange} />
      </Grid2>
      <Grid2 item size={4}>
        <BaseHouseDictionaryTable
          selectedBase={selectedBase}
          onRowSelectionModelChange={onHouseRowSelectionModelChange}
        />
      </Grid2>
      <Grid2 item size={8}>
        <BaseHouseRoomDictionaryTable
          selectedBase={selectedBase}
          selectedBaseHouse={selectedBaseHouse}
        />
      </Grid2>
    </Grid2>
  )
}
