import React from 'react'
import { Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { sizeClothOptions, sizeShoeOptions } from '../../constants'
import { AsynchronousAutocomplete } from '../AsynchronousAutocomplete'
import PhoneInput from 'react-phone-number-input/react-hook-form-input'
import { PhoneField } from '../formFields/PhoneField'
import { ProfileFormImage } from './ProfileFormImage'

export const ProfileForm = ({
  handleSaveProfileData,
  handleSubmit,
  control,
  errors,
  fetchAllCities,
  isDirty,
  handleReset,
  photo,
  currentMemberId,
  currentUserId,
}) => {
  return (
    <form onSubmit={handleSubmit(handleSaveProfileData)}>
      <Grid
        container
        justifyContent='center'
        // alignItems='center'
        flexDirection='column'
        spacing={2}
      >
        <ProfileFormImage
          photo={photo}
          currentMemberId={currentMemberId}
          currentUserId={currentUserId}
        />
        <Grid>
          <Controller
            name='memb_email'
            control={control}
            render={({ field }) => (
              <TextField {...field} variant='outlined' label='Email' disabled fullWidth />
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name='fio'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant='outlined'
                label='Фамилия Имя Отчество'
                fullWidth
                error={errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            )}
          />
        </Grid>
        <Grid>
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
        </Grid>
        <Grid>
          <Controller
            name='gender'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='ageLabel'>Пол</InputLabel>
                <Select {...field} label='Пол' fullWidth labelId='ageLabel'>
                  {['М', 'Ж'].map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name='size_shoe'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='sizeShoeLabel'>Размер обуви</InputLabel>
                <Select {...field} label='Размер обуви' fullWidth labelId='sizeShoeLabel'>
                  {sizeShoeOptions.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name='size_cloth'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='sizeClothLabel'>Размер одежды</InputLabel>
                <Select {...field} label='Размер одежды' fullWidth labelId='sizeClothLabel'>
                  {sizeClothOptions.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name='city'
            control={control}
            render={({ field }) => (
              <AsynchronousAutocomplete
                label='Город'
                request={fetchAllCities}
                dataNameField='name_city'
                field={field}
                errors={errors}
                secondarySourceArray={['count_name', 'okr_name', 'sub_name']}
              />
            )}
          />
        </Grid>
        <Grid>
          <PhoneInput
            control={control}
            rules={{ required: true }}
            name='tel_1'
            label='Телефон основной'
            defaultCountry='RU'
            inputComponent={PhoneField}
            error={errors['tel_1']}
            helperText={errors['tel_1']?.message}
          />
        </Grid>
        <Grid>
          <PhoneInput
            control={control}
            name='tel_2'
            label='Телефон экстренного контакта'
            defaultCountry='RU'
            inputComponent={PhoneField}
            error={errors['tel_2']}
            helperText={errors['tel_2']?.message}
          />
        </Grid>
        <Grid>
          <Controller
            name='emergency_contact'
            control={control}
            render={({ field }) => (
              <TextField {...field} variant='outlined' label='Имя экстренного контакта' fullWidth />
            )}
          />
        </Grid>
        <Grid>
          <Controller
            name='about_me'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant='outlined'
                label='О себе'
                fullWidth
                multiline
                maxRows={4}
              />
            )}
          />
        </Grid>
        <Grid container>
          <Grid>
            <Button variant='text' type='button' disabled={!isDirty} onClick={handleReset}>
              Отменить
            </Button>
          </Grid>
          <Grid>
            <Button variant='contained' type='submit' disabled={!isDirty}>
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
