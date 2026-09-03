import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useFetchEquipmentTypeList } from '../../../queries/equipment'
import { useFetchStorageList } from '../../../queries/equipment'

const validationSchema = Yup.object({
  equip_name: Yup.string().required('Поле обязательно для заполнения'),
  equip_storage: Yup.string().required('Поле обязательно для заполнения'),
  equip: Yup.string().required('Поле обязательно для заполнения'),
})

const defaultValues = {
  equip_name: '',
  equip: '',
  equip_id: null,
  equip_type: '',
  equip_storage: '',
  equip_storage_id: null,
  stor_name: '',
  quantity: 1,
  loss: false,
}

export const AddEquipmentDialog = ({ memberId, open, onClose, editingItem }) => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const isEdit = !!editingItem

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  })

  const { data: equipmentTypes } = useFetchEquipmentTypeList()
  const { data: storages } = useFetchStorageList()

  React.useEffect(() => {
    if (open) {
      if (isEdit && editingItem) {
        reset({
          equip_name: editingItem.equip_name || '',
          equip: editingItem.equip_type || '',
          equip_id: editingItem.equip || '',
          equip_type: editingItem.equip_type || '',
          equip_storage: editingItem.stor_name || '',
          equip_storage_id: editingItem.equip_storage || '',
          stor_name: editingItem.stor_name || '',
          quantity: editingItem.quantity || 1,
          loss: editingItem.loss || false,
        })
      } else {
        reset({ ...defaultValues })
      }
    }
  }, [open, isEdit, editingItem, reset])

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  const onSubmit = (data) => {
    const postData = {
      equip_member: memberId,
      equip_name: data.equip_name,
      equip: data.equip_id,
      equip_type: data.equip_type,
      equip_storage: data.equip_storage_id,
      stor_name: data.stor_name,
      quantity: Number(data.quantity),
      loss: data.loss,
    }

    const url = isEdit
      ? `/api/memberList/${memberId}/equipment/${editingItem.id}`
      : `/api/memberList/${memberId}/equipment`
    const method = isEdit ? 'post' : 'put'

    apiClient[method](url, postData).then(() => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'equipment'] })
      enqueueSnackbar(isEdit ? 'Снаряжение обновлено' : 'Снаряжение успешно добавлено', {
        variant: 'success',
      })
      handleClose()
    })
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ pr: 1 }}>
          {isEdit ? 'Редактировать снаряжение' : 'Добавить снаряжение'}
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Склад *
            </Typography>
            <Controller
              name='equip_storage'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.equip_storage}
                  helperText={errors.equip_storage?.message}
                  onChange={(e) => {
                    const selected = storages?.find((s) => s.stor_name === e.target.value)
                    setValue('stor_name', selected?.stor_name || '')
                    setValue('equip_storage_id', selected?.id || '')
                    field.onChange(e)
                  }}
                >
                  <MenuItem value='' disabled>
                    Выберите
                  </MenuItem>
                  {storages?.map((s) => (
                    <MenuItem key={s.id} value={s.stor_name}>
                      {s.stor_name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Тип снаряжения *
            </Typography>
            <Controller
              name='equip'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.equip}
                  helperText={errors.equip?.message}
                  onChange={(e) => {
                    const selected = equipmentTypes?.find(
                      (equip) => equip.equip_name === e.target.value,
                    )
                    setValue('equip_type', selected?.equip || '')
                    setValue('equip_id', selected?.id || '')
                    field.onChange(e)
                  }}
                >
                  <MenuItem value='' disabled>
                    Выберите
                  </MenuItem>
                  {equipmentTypes?.map((e) => (
                    <MenuItem key={e.id} value={e.equip_name}>
                      {e.equip_name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Название *
            </Typography>
            <Controller
              name='equip_name'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  error={!!errors.equip_name}
                  helperText={errors.equip_name?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Количество
            </Typography>
            <Controller
              name='quantity'
              control={control}
              render={({ field }) => (
                <TextField
                  type='number'
                  fullWidth
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name='loss'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} />}
                  label='Утеряно'
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type='submit' variant='contained'>
            {isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
