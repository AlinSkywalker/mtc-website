import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useDropzone } from 'react-dropzone'
import { useIsMobile } from '../../hooks/useIsMobile'
import { SERVER_REQUEST_ERROR } from '../../constants'
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
import apiClient from '../../api/api'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

export const ProfileFormImage = ({ photo, currentMemberId, currentUserId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPhoto, setNewPhoto] = useState(photo)
  useEffect(() => setNewPhoto(photo), [photo])
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const convertToBase64 = (file) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      // event.target.result содержит base64 строку
      const base64 = event.target.result
      // Можно также сохранить только data часть (без префикса)
      // const base64Data = base64?.split(',')[1] || ''
      setNewPhoto(base64)
      // console.log('Base64:', base64)
    }

    reader.onerror = (error) => {
      console.error('Error converting file to base64:', error)
    }

    // Читаем файл как Data URL (base64)
    reader.readAsDataURL(file)
  }

  const isMobile = useIsMobile()

  const maxSize = 10485760
  function fileSizeValidator(file) {
    if (file.size > maxSize) {
      return {
        code: 'size-too-large',
        message: `Файл больше ${maxSize}`,
      }
    }

    return null
  }

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    validator: fileSizeValidator,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        convertToBase64(file)
      }
    },
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  const handleClose = () => {
    setIsDialogOpen(false)
  }
  const handleSavePhoto = async () => {
    try {
      await apiClient.post(`/api/profile/${currentMemberId}/setPhoto`, { newPhoto })
      queryClient.invalidateQueries({ queryKey: ['profile', currentUserId] })
      setIsDialogOpen(false)
    } catch (error) {
      // Handle login error
      console.error(error)
      enqueueSnackbar(SERVER_REQUEST_ERROR, {
        variant: 'error',
        autoHideDuration: 5000,
      })
    }
  }

  return (
    <Grid
      sx={{
        width: '100%',
        marginBottom: 1,
        textAlign: 'center',
      }}
    >
      <Grid
        onClick={() => {
          setIsDialogOpen(true)
        }}
        sx={{ cursor: 'pointer' }}
      >
        <img alt='' src={photo} width='200' height='200' />
      </Grid>
      <Dialog onClose={handleClose} open={isDialogOpen} maxWidth='md'>
        <DialogTitle>
          Загрузка фото профиля
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
        </DialogTitle>

        <DialogContent sx={{ minWidth: '300px' }}>
          <Grid
            container
            alignItems={'center'}
            spacing={isMobile ? 0 : 2}
            direction={isMobile ? 'column' : 'row'}
          >
            <Grid width='200'>
              <img alt='' src={newPhoto} width='200' height='200' />
            </Grid>
            <Grid>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>
                  Перетащите сюда файл или нажмите для выбора.
                  <br />
                  Максимальный размер файла - 10МБ
                </p>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSavePhoto} autoFocus variant='contained'>
            Сохранить фото
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
