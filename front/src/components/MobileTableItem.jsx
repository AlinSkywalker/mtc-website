import React from 'react'
import { Card } from '@mui/material'

export const MobileTableItem = ({
  children,
  expandedData,
  handleItemClick,
  id,
  expandedItemId,
  setExpandedItemId,
  sx,
}) => {
  const handleItemClickName = () => {
    if (expandedData && setExpandedItemId && expandedItemId !== id) {
      setExpandedItemId(id)
    } else if (handleItemClick) {
      handleItemClick(id)
    } else if (setExpandedItemId) {
      setExpandedItemId()
    }
  }

  const isExpanded = id === expandedItemId
  return (
    <Card onClick={handleItemClickName} sx={{ margin: 2, padding: 2, ...sx }} key={id}>
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
