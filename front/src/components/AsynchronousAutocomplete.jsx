import React from 'react'
import { Autocomplete, CircularProgress, TextField, MenuItem, ListItemText } from '@mui/material'

export function AsynchronousAutocomplete({
  request,
  label,
  dataNameField,
  field,
  errors,
  secondarySourceArray,
  disabled = false,
}) {
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
  const renderAutocompleteOption = (props, option, { selected }) => {
    const { key, ...optionProps } = props
    let secondary = ''
    if (secondarySourceArray.length != 0) {
      const secondareArray = secondarySourceArray.map(
        (secondarySourceItem) => option[secondarySourceItem],
      )
      secondary = secondareArray.join(', ')
    }
    return (
      <MenuItem value={option.id} key={key} {...optionProps}>
        <ListItemText
          primary={option[dataNameField]}
          sx={{ width: '100%', whiteSpace: 'normal' }}
          secondary={secondary}
        />
      </MenuItem>
    )
  }
  return (
    <Autocomplete
      disabled={disabled}
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
      renderOption={renderAutocompleteOption}
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
