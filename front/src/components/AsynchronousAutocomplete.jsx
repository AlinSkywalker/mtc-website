import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

export function AsynchronousAutocomplete({ request, label, dataNameField, field, errors }) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const { onChange, value } = field

  const handleOpen = () => {
    setOpen(true)
    ;(async () => {
      setLoading(true)
      const { data } = await request()
      setLoading(false)

      setOptions(data)
    })()
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleChange = (newValue) => {
    onChange(newValue ? { id: newValue.id, [dataNameField]: newValue[dataNameField] } : null)
  }
  return (
    <Autocomplete
      fullWidth
      open={open}
      value={value}
      inputValue={value?.[dataNameField] || ''}
      onOpen={handleOpen}
      onClose={handleClose}
      onChange={(event, newValue) => {
        handleChange(newValue)
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option[dataNameField]}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={errors?.[field.name]}
          helperText={errors?.[field.name]?.message}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color='inherit' size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  )
}
