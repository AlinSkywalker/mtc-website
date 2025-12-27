import React, { useState } from 'react'
import { Grid, Typography } from '@mui/material'

import { MobileTableItem } from '../MobileTableItem'

export const MobileEventEquipmentTab = ({ data }) => {
  const [expandedItemId, setExpandedItemId] = useState('')

  const renderItem = (item) => {
    const expandedData = (
      <Grid size={12}>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{item.equip_desc}</Typography>
      </Grid>
    )
    return (
      <MobileTableItem
        key={item.id}
        id={item.id}
        expandedData={expandedData}
        expandedItemId={expandedItemId}
        setExpandedItemId={setExpandedItemId}
      >
        <Typography>
          {item.type}, {item.equip_type}, {item.equip_name} - {item.quantity} шт
        </Typography>
        <Typography>{item.event_desc}</Typography>
      </MobileTableItem>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
