import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
    GridActionsCellItem,
  } from '@mui/x-data-grid'

export const ActionsCellItem =({isInEditMode,handleSaveClick,handleCancelClick,handleEditClick,handleDeleteItem})=>{
    if (isInEditMode) {
        return [
          <GridActionsCellItem
            key={1}
            icon={<SaveIcon />}
            label='Сохранить'
            sx={{
              color: 'primary.main',
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            key={2}
            icon={<CancelIcon />}
            label='Отменить'
            className='textPrimary'
            onClick={handleCancelClick(id)}
            color='inherit'
          />,
        ]
      }
      return [
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          label='Редактировать'
          className='textPrimary'
          onClick={handleEditClick(id)}
          color='inherit'
        />,
        <GridActionsCellItem
          key={2}
          icon={<DeleteIcon />}
          label='Удалить'
          onClick={handleDeleteItem(id)}
          color='inherit'
        />,
      ]
}