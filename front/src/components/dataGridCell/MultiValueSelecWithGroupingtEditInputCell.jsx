import React, { useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import { useFetchDictionaryByName } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import './MultivalueAutocompleteWithGroup.css'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import CreateIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'

const StyledPopper = styled(Popper)({
  minWidth: 300,
})

export function MultiValueSelecWithGroupingtEditInputCell(props) {
  const {
    id,
    dictionaryName,
    nameListField,
    idListField,
    row,
    displayNameField,
    groupByField,
    labelField,
    hasFocus,
    colDef,
  } = props

  const { isLoading, data: dictionaryData } = useFetchDictionaryByName({
    dictionaryName,
    returnType: 'arrayType',
  })

  const nameList = row[nameListField]
  const idList = row[idListField]
  // console.log('nameList', dictionaryData)
  const apiRef = useGridApiContext()

  const [personName, setPersonName] = React.useState(nameList)
  const [personId, setPersonId] = React.useState(idList)

  const [autocompleteValue, setAutocompleteValue] = React.useState([])

  useEffect(() => {
    // console.log(personId)
    const newValue = dictionaryData?.filter((item) => personId?.includes(item.id)) || []
    setAutocompleteValue(newValue)
  }, [dictionaryData, personId])

  const handleChange = (event, newValue) => {
    // debugger
    const newName = newValue.map((item) => item[labelField])
    const newId = newValue.map((item) => item.id)
    setPersonName(newName)
    setPersonId(newId)
  }
  const handleWriteToRow = () => {
    // children
    apiRef.current.setEditCellValue({ id, field: displayNameField, value: personName?.join(', ') })
    apiRef.current.setEditCellValue({ id, field: nameListField, value: personName })
    apiRef.current.setEditCellValue({ id, field: idListField, value: personId })
    setAnchorEl(null)
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  return (
    <>
      <Grid container sx={{ width: '100%' }} flexWrap={'nowrap'}>
        <Grid item flexGrow={2} sx={{ pl: 2, overflow: 'hidden' }}>
          {nameList?.join(',')}
        </Grid>
        <Grid item flexShrink={0}>
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
            <FormControl fullWidth variant='standard' sx={{ padding: '0 10px' }}>
              {dictionaryData && (
                <Autocomplete
                  // onClose={handleWriteToRow}
                  multiple
                  options={dictionaryData}
                  // sx={{ width: 300 }}
                  value={autocompleteValue}
                  // inputValue={summitInputValue}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ fontSize: 14 }} value={personName?.join(', ')} />
                  )}
                  getOptionLabel={(option) => option[labelField]}
                  onChange={handleChange}
                  groupBy={(option) => option[groupByField]}
                  size='small'
                  MenuProps={{
                    sx: { maxWidth: 800, minWidth: 300 },
                    className: 'groupAutocomplete',
                  }}
                  fullWidth
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox checked={selected} sx={{ p: 0.5 }} />
                        <ListItemText
                          primary={option[labelField]}
                          sx={{ width: '100%', whiteSpace: 'normal' }}
                        />
                      </li>
                    )
                  }}
                  slots={{
                    popper: StyledPopper,
                  }}
                />
              )}
            </FormControl>
            <Button
              onClick={handleWriteToRow}
              // disabled={!summitAutocompleteValue.id}
              variant='contained'
            >
              Выбрать
            </Button>
          </Grid>
        </Box>
      </Popover>
    </>
  )
}
