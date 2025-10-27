import React from 'react'
import { Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Checkbox, FormControlLabel, Typography } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

export const RegistrationForm = ({
  handleLogin,
  handleSubmit,
  control,
  errors,
  consentValue,
  handleChangeConsentValue,
  serverError,
}) => {
  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        spacing={2}
      >
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              label='Email'
              error={errors[field.name]}
              helperText={errors[field.name]?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name='fio'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              label='ФИО'
              fullWidth
              error={errors[field.name]}
              helperText={errors[field.name]?.message}
            />
          )}
        />
        <Controller
          name='date_birth'
          control={control}
          render={({ field }) => (
            <DatePicker
              label='Дата рождения'
              {...field}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: errors[field.name],
                  helperText: errors[field.name]?.message,
                },
              }}
            />
          )}
        />
        <Controller
          name='gender'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id='genderLabel'>Пол</InputLabel>
              <Select {...field} label='Пол' fullWidth labelId='genderLabel'>
                {['М', 'Ж'].map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              label='Пароль'
              type='password'
              error={errors[field.name]}
              helperText={errors[field.name]?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name='password_repeat'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant='outlined'
              label='Повторите пароль'
              type='password'
              error={errors[field.name]}
              helperText={errors[field.name]?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name='personal_data_consent'
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              label={
                <Typography>
                  Даю согласие на{' '}
                  <Link to='/personalDataConsent' target='_blank'>
                    обработку своих персональных данных
                  </Link>
                </Typography>
              }
              control={<Checkbox checked={consentValue} onChange={handleChangeConsentValue} />}
            />
          )}
        />
        <Grid>
          <Button variant='contained' type='submit' disabled={!consentValue}>
            Зарегистрироваться
          </Button>
        </Grid>
        {serverError && (
          <Grid>
            <Typography sx={{ color: 'red' }}>
              Произошла ошибка при регистрации: {serverError}
            </Typography>
          </Grid>
        )}
        <Grid>
          <Link to='/login'>Войти в систему</Link>
        </Grid>
      </Grid>
    </form>
  )
}
