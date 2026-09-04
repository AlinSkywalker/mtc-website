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
  IconButton,
} from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { DEPARTMENT_TYPE_ARRAY } from '../../../constants'
import { useFetchMemberList } from '../../../queries/member'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'

const validationSchema = Yup.object({
  depart_tip: Yup.string().required('Поле обязательно для заполнения'),
  depart_name: Yup.string().required('Поле обязательно для заполнения'),
  depart_dates: Yup.string().required('Поле обязательно для заполнения'),
  depart_datef: Yup.string().required('Поле обязательно для заполнения'),
})
  .test({
    name: 'dates-order',
    exclusive: false,
    params: {},
    message: 'Дата начала не может быть больше даты окончания',
    test: (value, context) => {
      if (value.depart_dates && value.depart_datef) {
        return new Date(value.depart_dates) <= new Date(value.depart_datef)
      }
      return true
    },
  })
  .test({
    name: 'dates-order-2',
    exclusive: false,
    params: {},
    message: 'Дата окончания не может быть меньше даты начала',
    test: (value, context) => {
      if (value.depart_dates && value.depart_datef) {
        return new Date(value.depart_datef) >= new Date(value.depart_dates)
      }
      return true
    },
  })

const defaultValues = {
  depart_tip: '',
  depart_name: '',
  depart_dates: '',
  depart_datef: '',
  inst_fio: '',
  depart_inst: '',
}

export const EventDepartmentDialog = ({ eventId, open, onClose, editingItem }) => {
  const isEdit = !!editingItem
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  })

  const departTip = watch('depart_tip')
  const instructorHookParams = ['НП', 'УТ'].includes(departTip)
    ? { possibleRole: 'instructor' }
    : {}
  const { data: members } = useFetchMemberList(instructorHookParams)

  React.useEffect(() => {
    if (open) {
      if (isEdit && editingItem) {
        reset({
          depart_tip: editingItem.depart_tip || '',
          depart_name: editingItem.depart_name || '',
          depart_dates: editingItem.depart_dates || '',
          depart_datef: editingItem.depart_datef || '',
          inst_fio: editingItem.inst_fio || '',
          depart_inst: editingItem.depart_inst || '',
        })
      } else {
        reset({ ...defaultValues })
      }
    } else {
      reset({ ...defaultValues })
    }
  }, [open, isEdit, editingItem, reset])

  const handleClose = () => {
    reset(defaultValues)
    onClose()
  }

  const onSubmit = (data) => {
    const postData = {
      ...data,
      id: isEdit ? editingItem.id : undefined,
      isNew: !isEdit,
      event_start: editingItem?.event_start || '',
      event_finish: editingItem?.event_finish || '',
    }

    const url = isEdit
      ? `/api/eventList/${eventId}/department/${editingItem.id}`
      : `/api/eventList/${eventId}/department`
    const method = isEdit ? 'post' : 'put'

    const apiCall = apiClient[method](url, postData)
    apiCall.then(() => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'department'] })
      handleClose()
    })
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ pr: 1 }}>
          {isEdit ? 'Редактировать подразделение' : 'Добавить подразделение'}
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
              Тип *
            </Typography>
            <Controller
              name='depart_tip'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.depart_tip}
                  helperText={errors.depart_tip?.message}
                  onChange={field.onChange}
                >
                  <MenuItem value='' disabled>
                    Выберите
                  </MenuItem>
                  {[...DEPARTMENT_TYPE_ARRAY, 'ХЗ'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Позывной *
            </Typography>
            <Controller
              name='depart_name'
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  error={!!errors.depart_name}
                  helperText={errors.depart_name?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Старт *
            </Typography>
            <Controller
              name='depart_dates'
              control={control}
              render={({ field }) => (
                <TextField
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  error={!!errors.depart_dates}
                  helperText={errors.depart_dates?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Финиш *
            </Typography>
            <Controller
              name='depart_datef'
              control={control}
              render={({ field }) => (
                <TextField
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  error={!!errors.depart_datef}
                  helperText={errors.depart_datef?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Инструктор/Тренер
            </Typography>
            <Controller
              name='inst_fio'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.inst_fio}
                  helperText={errors.inst_fio?.message}
                  onChange={(e) => {
                    const selectedMember = members?.find((m) => m.fio === e.target.value)
                    setValue('depart_inst', selectedMember?.id || '')
                    field.onChange(e)
                  }}
                >
                  <MenuItem value='' disabled>
                    Выберите
                  </MenuItem>
                  {members?.map((member) => (
                    <MenuItem key={member.id} value={member.fio}>
                      {member.fio}
                    </MenuItem>
                  ))}
                </TextField>
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
