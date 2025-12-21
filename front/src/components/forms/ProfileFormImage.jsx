import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useDropzone } from 'react-dropzone'
import { useIsMobile } from '../../hooks/useIsMobile'
import { SERVER_REQUEST_ERROR } from '../../constants'
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
import apiClient from '../../api/api'
import DefaultImage from '../../assets/default_profile.jpg'

import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'
import { acceptStyle, baseStyle, focusedStyle, rejectStyle } from './dropzone.styles'



const FilerobotImageEditorWrap = styled('div')({
  '& .FIE_tabs': {
    display: 'none',
  },
})

export const ProfileFormImage = ({ photo, currentMemberId, currentUserId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaveAvailable, setIsSaveAvailable] = useState(false)
  const [newPhoto, setNewPhoto] = useState(photo)
  const [newPhotoImage, setNewPhotoImage] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const openImgEditor = (image) => {
    setNewPhotoImage(image)
  }

  const closeImgEditor = () => {
    setNewPhotoImage()
  }

  useEffect(() => setNewPhoto(photo), [photo])
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const convertToBase64 = (file) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      // event.target.result содержит base64 строку
      var image = new Image()
      image.src = event.target.result

      image.onload = function () {
        // if (this.width / this.height > 1.1 || this.height / this.width > 1.1) {
        //   enqueueSnackbar('Изображение должно иметь соотношение сторон 1:1', {
        //     variant: 'error',
        //     autoHideDuration: 5000,
        //   })
        // } else {

        // }
        // const base64 = event.target.result
        // setNewPhoto(base64)
        openImgEditor(image)
      }

      // Можно также сохранить только data часть (без префикса)
      // const base64Data = base64?.split(',')[1] || ''

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
    console.log('file', file)
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
    setNewPhotoImage()
  }
  const handleSavePhoto = async () => {
    try {
      setIsLoading(true)
      const result = await apiClient.post(`/api/profile/${currentMemberId}/setPhoto`, { newPhoto })
      setIsLoading(false)
      if (!result) {
        enqueueSnackbar(SERVER_REQUEST_ERROR, {
          variant: 'error',
          autoHideDuration: 5000,
        })
      } else {
        setIsDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ['profile', currentUserId] })
      }
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
        <img alt='' src={newPhoto || DefaultImage} width='200' height='200' />
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
        {!newPhotoImage && (
          <>
            <DialogContent sx={{ minWidth: '300px' }}>
              <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
              <Grid
                container
                alignItems={'center'}
                spacing={isMobile ? 0 : 2}
                direction={isMobile ? 'column' : 'row'}
              >
                <Grid width='200'>
                  <img alt='' src={newPhoto || DefaultImage} width='200' height='200' />
                </Grid>
                <Grid>
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <p>
                      Перетащите сюда файл или нажмите для выбора.
                      <br />
                      Максимальный размер файла - 10МБ
                      <br />
                      Изображение должно иметь соотношение сторон 1:1
                    </p>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Отмена</Button>
              <Button
                onClick={handleSavePhoto}
                autoFocus
                variant='contained'
                disabled={!isSaveAvailable || isLoading}
              >
                Сохранить фото
              </Button>
            </DialogActions>
          </>
        )}
        {!!newPhotoImage && (
          <FilerobotImageEditorWrap>
            <FilerobotImageEditor
              translations={{
                save: 'Сохранить',
                cropTool: 'Обрезать',
                rotateTool: 'Повернуть',
                flipX: 'Отразить по оси X',
                flipY: 'Отразить по оси Y',
              }}
              language='ru'
              closeAfterSave={true}
              defaultSavedImageName={'photo'}
              source={newPhotoImage}
              onBeforeSave={() => false}
              onSave={(editedImageObject, designState) => {
                console.log('saved', editedImageObject, designState)
                if (editedImageObject.height === editedImageObject.width) {
                  setNewPhoto(editedImageObject.imageBase64)
                  setNewPhotoImage()
                  setIsSaveAvailable(true)
                } else {
                  enqueueSnackbar('Изображение должно иметь соотношение сторон 1:1', {
                    variant: 'error',
                    autoHideDuration: 5000,
                  })
                }
              }}
              onClose={() => {
                closeImgEditor()
                setNewPhotoImage()
              }}
              annotationsCommon={{
                fill: '#ff0000',
              }}
              Text={{ text: 'Filerobot...' }}
              Rotate={{ angle: 90, componentType: 'slider' }}
              Crop={{
                ratio: 1,
                ratioTitleKey: 'Обрезать',
                noPresets: true,
              }}
              tabsIds={[TABS.ADJUST]} // or {['Adjust', 'Annotate', 'Watermark']}
              defaultTabId={TABS.ADJUST} // or 'Annotate'
              defaultToolId={TOOLS.CROP} // or 'Text'
            />
          </FilerobotImageEditorWrap>
        )}
      </Dialog>
    </Grid>
  )
}
