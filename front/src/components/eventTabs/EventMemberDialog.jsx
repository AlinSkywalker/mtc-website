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
import { useFetchMemberList } from '../../queries/member'
import apiClient from '../../api/api'

const validationSchema = Yup.object({
  fio: Yup.string().required('Поле обязательно для заполнения'),
  eventmemb_dates: Yup.string().required('Поле обязательно для заполнения'),
  eventmemb_datef: Yup.string()
    .required('Поле обязательно для заполнения')
    .test({
      name: 'datef-after-dates',
      exclusive: false,
      params: {},
      message: 'Дата выезда не может быть раньше даты заезда',
      test: (value, context) => {
        if (value && context.parent.eventmemb_dates) {
          return new Date(value) >= new Date(context.parent.eventmemb_dates)
        }
        return true
      },
    }),
})

const defaultValues = {
  fio: '',
  eventmemb_memb: '',
  eventmemb_dates: '',
  eventmemb_datef: '',
  eventmemb_nstrah: false,
  eventmemb_nmed: false,
  eventmemb_role: 'Участник',
  eventmemb_pred: 0,
  eventmemb_gen: false,
  strah_file: null,
  med_file: null,
}

export const EventMemberDialog = ({ eventId, open, onClose, editingItem }) => {
  const isEdit = !!editingItem

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

  const { data: members } = useFetchMemberList()

  React.useEffect(() => {
    if (open) {
      if (isEdit && editingItem) {
        reset({
          fio: editingItem.fio || '',
          eventmemb_memb: editingItem.eventmemb_memb || '',
          eventmemb_dates: editingItem.eventmemb_dates || '',
          eventmemb_datef: editingItem.eventmemb_datef || '',
          eventmemb_nstrah: editingItem.eventmemb_nstrah || false,
          eventmemb_nmed: editingItem.eventmemb_nmed || false,
          eventmemb_role: editingItem.eventmemb_role || 'Участник',
          eventmemb_pred: editingItem.eventmemb_pred || 0,
          eventmemb_gen: editingItem.eventmemb_gen || false,
          strah_file: null,
          med_file: null,
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
    const { fio, eventmemb_memb, ...restData } = data
    const postedData = {
      ...restData,
      fio,
      eventmemb_memb: eventmemb_memb || editingItem?.eventmemb_memb,
      id: isEdit ? editingItem.id : undefined,
      isNew: !isEdit,
    }

    const formData = new FormData()
    formData.append('data', JSON.stringify(postedData))

    if (data.strah_file?.[0]) {
      formData.append('strah_file', data.strah_file[0])
    }
    if (data.med_file?.[0]) {
      formData.append('med_file', data.med_file[0])
    }

    const url = isEdit
      ? `/api/eventList/${eventId}/member/${editingItem.id}`
      : `/api/eventList/${eventId}/member`
    const method = isEdit ? 'post' : 'put'

    apiClient[method](url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(() => {
      handleClose()
    })
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ pr: 1 }}>
          {isEdit ? 'Редактировать участника' : 'Добавить участника'}
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
              ФИО *
            </Typography>
            <Controller
              name='fio'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.fio}
                  helperText={errors.fio?.message}
                  onChange={(e) => {
                    const selectedMember = members?.find((m) => m.fio === e.target.value)
                    setValue('eventmemb_memb', selectedMember?.id || '')
                    field.onChange(e)
                  }}
                >
                  <MenuItem value='' disabled>
                    Выберите
                  </MenuItem>
                  {members?.map((member) => {
                    const secondary = [member.alprazr, member.skali, member.ledu]
                      .filter(Boolean)
                      .join(', ')
                    return (
                      <MenuItem key={member.id} value={member.fio}>
                        {member.fio}
                        {secondary && (
                          <Typography variant='caption' sx={{ color: 'text.secondary', ml: 1 }}>
                            ({secondary})
                          </Typography>
                        )}
                      </MenuItem>
                    )
                  })}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Дата заезда *
            </Typography>
            <Controller
              name='eventmemb_dates'
              control={control}
              render={({ field }) => (
                <TextField
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  error={!!errors.eventmemb_dates}
                  helperText={errors.eventmemb_dates?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Дата выезда *
            </Typography>
            <Controller
              name='eventmemb_datef'
              control={control}
              render={({ field }) => (
                <TextField
                  type='date'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...field}
                  error={!!errors.eventmemb_datef}
                  helperText={errors.eventmemb_datef?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Роль *
            </Typography>
            <Controller
              name='eventmemb_role'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  {...field}
                  error={!!errors.eventmemb_role}
                  helperText={errors.eventmemb_role?.message}
                  onChange={field.onChange}
                >
                  {['Участник', 'Инструктор', 'Стажёр', 'Турист', 'Спортсмен'].map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Оплата
            </Typography>
            <Controller
              name='eventmemb_pred'
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
              name='eventmemb_nstrah'
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  <Typography>Страховка</Typography>
                </Box>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name='eventmemb_nmed'
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  <Typography>Справка</Typography>
                </Box>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name='eventmemb_gen'
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                  />
                  <Typography>Проживание по полу</Typography>
                </Box>
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Файл страховки
            </Typography>
            <Controller
              name='strah_file'
              control={control}
              render={({ field }) => (
                <TextField
                  type='file'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    field.onChange(e.target.files)
                  }}
                  InputProps={{
                    endAdornment: field.value?.[0] ? (
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        {field.value[0].name}
                      </Typography>
                    ) : null,
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Файл справки
            </Typography>
            <Controller
              name='med_file'
              control={control}
              render={({ field }) => (
                <TextField
                  type='file'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    field.onChange(e.target.files)
                  }}
                  InputProps={{
                    endAdornment: field.value?.[0] ? (
                      <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                        {field.value[0].name}
                      </Typography>
                    ) : null,
                  }}
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
