import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
} from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import apiClient from '../../../api/api'
import { eventDepartmentPlanValidationSchema } from '../../../validations/eventDepartmentPlanValidation'
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { DEPARTMENT_PLAN_TYPES } from '../../../constants'
import { useFetchEventDepartmentMemberList } from '../../../queries/eventDepartment'
import { useFetchLaboratoryForEvent } from '../../../queries/dictionary'
import { useFetchDictionaryByName } from '../../../queries/dictionary'

const defaultValues = {
  type: '',
  laba_name: '',
  laba: '',
  rout_name: '',
  mount_name: '',
  mount_id: '',
  ascent_head_fio: '',
  comment: '',
  start: '',
}

export const EventDepartmentPlanDialog = ({
  eventId,
  departmentId,
  date,
  plan,
  fixedDistrict,
  open,
  setOpen,
}) => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const isEdit = !!plan
  console.log('plan', plan)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(eventDepartmentPlanValidationSchema),
  })

  const watchType = useWatch({ name: 'type', control })
  const selectedMountId = useWatch({ name: 'mount_id', control, defaultValue: '' })

  const showLaba = watchType === 'Занятие' || watchType === 'Отдых' || watchType === 'Подход/отход'
  const showAscent = watchType === 'Восхождение'

  const { data: labaData } = useFetchLaboratoryForEvent({ eventId })
  const labaOptions = labaData?.map((l) => ({ id: l.id, name: l.laba_name }))

  const { data: membersData } = useFetchEventDepartmentMemberList({
    eventId,
    departmentId,
    selectedDate: plan?.start || date,
  })
  const membersOptions = membersData?.map((m) => ({ id: m.member_id, name: m.member_fio }))

  const { data: summitData } = useFetchDictionaryByName({
    dictionaryName: 'summitDictionary',
    returnType: 'arrayType',
  })
  const summitOptions = summitData
    ?.filter((item) => fixedDistrict?.includes(item.mount_rai))
    ?.map((s) => ({ id: s.id, name: s.mount_name }))

  const { data: routeData } = useFetchDictionaryByName({
    dictionaryName: 'routeDictionary',
    returnType: 'arrayType',
  })
  const routeOptions = routeData
    ? selectedMountId
      ? routeData
        .filter((r) => r.rout_mount === selectedMountId)
        .map((r) => ({ id: r.id, name: r.rout_name }))
      : routeData.map((r) => ({ id: r.id, name: r.rout_name }))
    : []

  React.useEffect(() => {
    if (open) {
      if (isEdit && plan) {
        reset({
          type: plan.type || '',
          laba_name: plan.laba_name || '',
          laba: plan.laba || '',
          rout_name: plan.rout_name || '',
          mount_name: plan.mount_name || '',
          mount_id: plan.rout_mount || '',
          ascent_head_fio: plan.ascent_head_fio || '',
          comment: plan.comment || '',
          start: plan.start,
        })
      } else {
        reset({ ...defaultValues, start: date })
      }
    }
  }, [open, isEdit, plan, reset, date])

  const handleClose = () => {
    reset(defaultValues)
    setOpen(false)
  }

  const onSubmit = (data) => {
    const postData = {
      department: departmentId,
      start: isEdit ? plan.start : date,
      type: data.type,
      laba_name:
        data.type === 'Занятие' || data.type === 'Отдых' || data.type === 'Подход/отход'
          ? data.laba_name
          : null,
      laba:
        data.type === 'Занятие' || data.type === 'Отдых' || data.type === 'Подход/отход'
          ? data.laba
          : null,
      rout_name: data.type === 'Восхождение' ? data.rout_name : null,
      rout_mount: data.type === 'Восхождение' ? data.mount_id : null,
      route: data.type === 'Восхождение' ? data.route_id : null,
      mount_name: data.type === 'Восхождение' ? data.mount_name : null,
      ascent_head_fio: data.type === 'Восхождение' ? data.ascent_head_fio : null,
      ascent_head: data.type === 'Восхождение' ? data.ascent_head_id : null,
      comment: data.comment,
      ob_agreement: 0,
    }

    const url = isEdit
      ? `/api/eventList/${eventId}/department/${departmentId}/plan/${plan.id}`
      : `/api/eventList/${eventId}/department/${departmentId}/plan/`
    const method = isEdit ? 'post' : 'put'

    apiClient[method](url, postData).then(() => {
      queryClient.invalidateQueries({
        queryKey: ['event', eventId, 'department', departmentId, 'plan'],
      })
      queryClient.invalidateQueries({
        queryKey: ['event', eventId, 'department', 'allDepartmentPlan'],
      })
      enqueueSnackbar(isEdit ? 'План успешно обновлен' : 'План успешно создан', {
        variant: 'success',
      })
      handleClose()
    })
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth='sm'>
      <DialogTitle>
        {isEdit ? 'Редактировать план отделения' : 'Добавить план отделения'}
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ minWidth: '300px' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Дата:
            </Typography>
            <TextField fullWidth value={isEdit ? plan?.start : date} disabled />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
              Тип плана *
            </Typography>
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label='Выберите тип'
                  fullWidth
                  {...field}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                >
                  {DEPARTMENT_PLAN_TYPES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          {showLaba && (
            <Controller
              name='laba_name'
              control={control}
              render={({ field }) => (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
                    Лаборатория
                  </Typography>
                  <TextField
                    select
                    label='Название лаборатории'
                    fullWidth
                    {...field}
                    error={!!errors.laba_name}
                    helperText={errors.laba_name?.message}
                    onChange={(e) => {
                      const selected = labaOptions?.find((l) => l.name === e.target.value)
                      setValue('laba', selected?.id || '')
                      field.onChange(e)
                    }}
                  >
                    <MenuItem value='' disabled>
                      Выберите
                    </MenuItem>
                    {labaOptions?.map((l) => (
                      <MenuItem key={l.id} value={l.name}>
                        {l.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            />
          )}

          {showAscent && (
            <>
              <Controller
                name='mount_name'
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
                      Гора
                    </Typography>
                    <TextField
                      select
                      label='Название горы'
                      fullWidth
                      {...field}
                      onChange={(e) => {
                        const selected = summitOptions?.find((s) => s.name === e.target.value)
                        setValue('mount_id', selected?.id || '')
                        setValue('rout_name', '')
                        field.onChange(e)
                      }}
                      error={!!errors.mount_name}
                      helperText={errors.mount_name?.message}
                    >
                      <MenuItem value='' disabled>
                        Выберите
                      </MenuItem>
                      {summitOptions?.map((s) => (
                        <MenuItem key={s.id} value={s.name}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}
              />

              <Controller
                name='rout_name'
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
                      Маршрут *
                    </Typography>
                    <TextField
                      select
                      label='Название маршрута'
                      fullWidth
                      {...field}
                      error={!!errors.rout_name}
                      helperText={errors.rout_name?.message}
                      onChange={(e) => {
                        const selected = routeOptions?.find((s) => s.name === e.target.value)
                        setValue('route_id', selected?.id || '')
                        field.onChange(e)
                      }}
                    >
                      <MenuItem value='' disabled>
                        Выберите
                      </MenuItem>
                      {routeOptions?.map((r) => (
                        <MenuItem key={r.id} value={r.name}>
                          {r.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}
              />

              <Controller
                name='ascent_head_fio'
                control={control}
                render={({ field }) => (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
                      Руководитель восхождения
                    </Typography>
                    <TextField
                      select
                      label='ФИО руководителя'
                      fullWidth
                      {...field}
                      error={!!errors.ascent_head_fio}
                      helperText={errors.ascent_head_fio?.message}
                      onChange={(e) => {
                        const selected = membersOptions?.find((s) => s.name === e.target.value)
                        setValue('ascent_head_id', selected?.id || '')
                        field.onChange(e)
                      }}
                    >
                      <MenuItem value='' disabled>
                        Выберите
                      </MenuItem>
                      {membersOptions?.map((m) => (
                        <MenuItem key={m.id} value={m.name}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}
              />
            </>
          )}

          <Controller
            name='comment'
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' sx={{ fontWeight: '600', mb: 0.5 }}>
                  Комментарий
                </Typography>
                <TextField multiline rows={3} label='Комментарий' fullWidth {...field} />
              </Box>
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type='submit' variant='contained'>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
