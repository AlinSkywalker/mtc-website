import React from 'react'
import { Grid, IconButton, Tooltip, Typography } from '@mui/material'
import InfoOutlineIcon from '@mui/icons-material/InfoOutline'

export const MobileEventEquipmentTab = ({ data }) => {
  let previousType = ''
  let previousEquipType = ' '
  const renderItem = (item) => {
    const displayType = item.type !== previousType
    previousType = item.type
    const displayEquipType = item.equip_type !== previousEquipType
    previousEquipType = item.equip_type
    return (
      <>
        {displayType && (
          <Typography variant='h5' sx={{ fontSize: '19px', fontWeight: 'bold' }}>
            {item.type}
          </Typography>
        )}
        {displayEquipType && (
          <Typography variant='h5' sx={{ fontSize: '17px', fontWeight: 'bold' }}>
            {item.equip_type}
          </Typography>
        )}
        <Grid container sx={{ alignItems: 'center' }}>
          <Typography>
            {item.equip_name} - {item.quantity} шт
          </Typography>
          <Grid sx={{ height: 36, width: 36 }}>
            {item.equip_desc && (
              <Tooltip title={item.equip_desc}>
                <IconButton>
                  <InfoOutlineIcon fontSize='small' color='info' />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Typography>{item.event_desc}</Typography>
        </Grid>
      </>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
