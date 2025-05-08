import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useFetchTrainingProgram } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'
import CreateIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'

export function EditTrainingProgramMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const { id, row, displayField, nameField } = props

  const { progp, prog_tem, prog_razd } = row
  const { data } = useFetchTrainingProgram()
  const programData = data?.data
  const razdelList = data?.razdelList

  const [razdelAutocompleteOptions, setRazdelAutocompleteOptions] = useState(razdelList)
  const [razdelAutocompleteValue, setRazdelAutocompleteValue] = useState(prog_razd)
  const [razdelInputValue, setRazdelInputValue] = React.useState(prog_razd)

  const [programDataAutocompleteOptions, setProgramDataAutocompleteOptions] = useState(programData)
  const [programDataAutocompleteValue, setProgramDataAutocompleteValue] = useState({
    id: progp,
    name: prog_tem,
  })
  const [programDataInputValue, setProgramDataInputValue] = React.useState(progp || '')
  useEffect(() => {
    setRazdelAutocompleteOptions(razdelList)
  }, [razdelList])

  useEffect(() => {
    setProgramDataAutocompleteOptions(programData)
  }, [programData])

  const handleRazdelChange = (newValue) => {
    setRazdelAutocompleteValue(newValue)
    setProgramDataAutocompleteValue({ name: '', id: '' })
    setProgramDataInputValue()
    setProgramDataAutocompleteOptions(
      newValue ? programData.filter((item) => item.prog_razd == newValue) : programData,
    )
  }

  const apiRef = useGridApiContext()

  const handleSubmit = () => {
    handleClose()
    apiRef.current.setEditCellValue({
      id,
      field: nameField,
      value: programDataAutocompleteValue.id,
    })
    apiRef.current.setEditCellValue({
      id,
      field: displayField,
      value: programDataAutocompleteValue.prog_tem,
    })
  }

  const displayValue = row[displayField]
  const submitDisabled = !programDataAutocompleteValue?.id

  if (!data) return

  return (
    <>
      <Grid container sx={{ width: '100%' }} flexWrap={'nowrap'}>
        <Grid flexGrow={2} sx={{ pl: 2, overflow: 'hidden' }}>
          {displayValue}
        </Grid>
        <Grid flexShrink={0}>
          <IconButton onClick={handleClick}>
            <CreateIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Popover
        id={'summit-select'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Grid container flexDirection={'column'} spacing={2}>
            <Autocomplete
              id='section'
              value={razdelAutocompleteValue}
              inputValue={razdelInputValue}
              size='small'
              MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
              options={razdelAutocompleteOptions}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => {
                handleRazdelChange(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setRazdelInputValue(newInputValue)
              }}
              fullWidth
            />

            <Autocomplete
              id='topic-select'
              value={programDataAutocompleteValue}
              inputValue={programDataInputValue}
              size='small'
              MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
              options={programDataAutocompleteOptions}
              getOptionLabel={(option) => option.prog_tem || ''}
              onChange={(event, newValue) => {
                setProgramDataAutocompleteValue(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setProgramDataInputValue(newInputValue)
              }}
              fullWidth
            />
            <Button onClick={handleSubmit} disabled={submitDisabled} variant='contained'>
              Выбрать
            </Button>
          </Grid>
        </Box>
      </Popover>
    </>
  )
}
