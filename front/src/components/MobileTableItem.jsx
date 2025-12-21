import React, { useState } from 'react'
import { Card } from '@mui/material'

export const MobileTableItem = ({
  children,
  expandedData,
  handleItemClick,
  id,
  expandedItemId,
  setExpandedItemId,
}) => {
  const handleItemClickName = () => {
    if (expandedData && setExpandedItemId && expandedItemId !== id) {
      setExpandedItemId(id)
    } else if (handleItemClick) {
      handleItemClick(id)
    } else {
      setExpandedItemId()
    }
  }

  const isExpanded = id === expandedItemId
  return (
    <Card onClick={handleItemClickName} sx={{ margin: 2, padding: 2 }} key={id}>
      {children}

      {isExpanded && (
        <>
          <br />
          {expandedData}
        </>
      )}
    </Card>
  )
}
