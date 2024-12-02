import React from 'react'
import { Button, DialogContent, Dialog, IconButton, DialogActions } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export const DictionaryEditDialog = ({ children, onClose, open, handleSubmit, handleSave }) => {
  const handleClose = () => {
    onClose()
  }

  // if (isLoading) return null
  return (
    <BootstrapDialog onClose={handleClose} open={open} maxWidth='xs' fullWidth>
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Создание записи в справочнике
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button type='submit'>Сохранить</Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  )
}
