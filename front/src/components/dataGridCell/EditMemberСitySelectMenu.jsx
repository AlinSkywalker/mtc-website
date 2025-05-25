import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useFetchDictionaryByName } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'
import CreateIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'

function mapDictionaryData(dictionaryName, dictionaryData = []) {
  return dictionaryData.map((item) => {
    let itemName = ''
    let parentId = ''
    let secondary = ''
    switch (dictionaryName) {
      //country
      //okrug
      //subekt

      case 'countryDictionary':
        itemName = item.city_name
        break
      case 'okrugDictionary':
        itemName = item.city_name
        parentId = item.okr_count
        break
      case 'subektDictionary':
        itemName = item.city_name
        parentId = item.sub_okr
        break
      case 'cityDictionary':
        itemName = item.city_name
        parentId = item.city_sub
        break

      default:
        itemName = ''
        break
    }
    return { id: item.id, name: itemName, parentId, secondary }
  })
}

export const EditMemberСitySelectMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const { id, row, finishDictionary, displayField, fixedDistrict, nameField } = props
  const { region_name, rai_reg, rai_name, mount_rai, mount_name, rout_mount, rout_name } = row
  const { data: countryData } = useFetchDictionaryByName({
    dictionaryName: 'countryDictionary',
    returnType: 'arrayType',
  })
  const { data: okrugData } = useFetchDictionaryByName({
    dictionaryName: 'okrugDictionary',
    returnType: 'arrayType',
  })
  const { data: subektData } = useFetchDictionaryByName({
    dictionaryName: 'subektDictionary',
    returnType: 'arrayType',
  })
  const { data: cityData } = useFetchDictionaryByName({
    dictionaryName: 'cityDictionary',
    returnType: 'arrayType',
  })

  const countryMappedData = mapDictionaryData('countryDictionary', countryData)
  const okrugMappedData = mapDictionaryData('okrugDictionary', okrugData)
  const subektMappedData = mapDictionaryData('subektDictionary', subektData)
  const cityMappedData = mapDictionaryData('cityDictionary', cityData)

  const [countryAutocompleteOptions, setCountryAutocompleteOptions] = useState(countryMappedData)
  const [countryAutocompleteValue, setCountryAutocompleteValue] = useState({
    id: rai_reg || '',
    name: country_name || '',
    parentId: '',
  })
  const [countryInputValue, setCountryInputValue] = React.useState(country_name)

  const [okrugAutocompleteOptions, setOkrugAutocompleteOptions] = useState(okrugMappedData)
  const [okrugAutocompleteValue, setOkrugAutocompleteValue] = useState({
    id: mount_rai || '',
    name: rai_name || '',
    parentId: rai_reg || '',
  })
  const [okrugInputValue, setOkrugInputValue] = React.useState(okrug_name)

  const [subektAutocompleteOptions, setSubektAutocompleteOptions] = useState(subektMappedData)
  const [subektAutocompleteValue, setSubektAutocompleteValue] = useState({
    id: rout_mount || '',
    name: mount_name || '',
    parentId: mount_rai || '',
  })
  const [subektInputValue, setSubektInputValue] = React.useState(subekt_name)

  const [cityAutocompleteOptions, setCityAutocompleteOptions] = useState(cityMappedData)
  const [cityAutocompleteValue, setCityAutocompleteValue] = useState({
    id: id || '',
    name: rout_name || '',
    parentId: rout_mount || '',
  })
  const [cityInputValue, setCityInputValue] = React.useState(city_name)

  useEffect(() => {
    setCountryAutocompleteOptions(countryMappedData)
  }, [countryData])

  useEffect(() => {
    let newData = okrugMappedData
    if (rai_reg) {
      newData = newData.filter((item) => item.parentId == rai_reg)
    }
    setOkrugAutocompleteOptions(newData)
  }, [okrugData])

  useEffect(() => {
    let newData = subektMappedData
    if (mount_rai) {
      newData = newData.filter((item) => item.parentId == mount_rai)
    }
    setSubektAutocompleteOptions(newData)
  }, [subektData])

  useEffect(() => {
    let newData = cityMappedData
    if (mount_rai) {
      newData = newData.filter((item) => item.parentId == rout_mount)
    }
    setCityAutocompleteOptions(newData)
  }, [cityData])

  const handleCountryChange = (newValue) => {
    setCountryAutocompleteValue(newValue)

    setOkrugAutocompleteValue({ name: '', id: '', parentId: '' })
    setOkrugInputValue('')

    setSubektAutocompleteValue({ name: '', id: '', parentId: '' })
    setSubektInputValue('')

    setCityAutocompleteValue({ name: '', id: '', parentId: '' })
    setCityInputValue('')

    setOkrugAutocompleteOptions(
      newValue ? okrugMappedData.filter((item) => item.parentId == newValue.id) : okrugMappedData,
    )
  }

  const handleDistrictChange = (newValue) => {
    setOkrugAutocompleteValue(newValue)

    setSubektAutocompleteValue({ name: '', id: '', parentId: '' })
    setSubektInputValue('')

    setCityAutocompleteValue({ name: '', id: '', parentId: '' })
    setCityInputValue('')

    setSubektAutocompleteOptions(
      newValue ? subektMappedData.filter((item) => item.parentId == newValue.id) : subektMappedData,
    )
  }

  const handleSubektChange = (newValue) => {
    setSubektAutocompleteValue(newValue)

    setCityAutocompleteValue({ name: '', id: '', parentId: '' })
    setCityInputValue('')

    setCityAutocompleteOptions(
      newValue ? cityMappedData.filter((item) => item.parentId == newValue.id) : cityMappedData,
    )
  }

  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const handleSubmit = () => {
    handleClose()

    apiRef.current.setEditCellValue({ id, field: 'rai_reg ', value: countryAutocompleteValue.id })
    apiRef.current.setEditCellValue({
      id,
      field: 'region_name',
      value: countryAutocompleteValue.name,
    })

    apiRef.current.setEditCellValue({ id, field: 'mount_rai', value: okrugAutocompleteValue.id })
    apiRef.current.setEditCellValue({
      id,
      field: 'rai_name',
      value: okrugAutocompleteValue.name,
    })
    if (finishDictionary == 'routeDictionary' || finishDictionary == 'summitDictionary') {
      apiRef.current.setEditCellValue({
        id,
        field: 'rout_mount',
        value: subektAutocompleteValue.id,
      })
      apiRef.current.setEditCellValue({
        id,
        field: 'mount_name',
        value: subektAutocompleteValue.name,
      })
    }
    if (finishDictionary == 'routeDictionary') {
      apiRef.current.setEditCellValue({ id, field: 'asc_route', value: cityAutocompleteValue.id })
      apiRef.current.setEditCellValue({
        id,
        field: 'rout_name',
        value: cityAutocompleteValue.name,
      })
    }
    if (nameField) {
      if (finishDictionary == 'districtDictionary')
        apiRef.current.setEditCellValue({
          id,
          field: nameField,
          value: okrugAutocompleteValue.id,
        })
      if (finishDictionary == 'routeDictionary')
        apiRef.current.setEditCellValue({ id, field: nameField, value: cityAutocompleteValue.id })
      if (finishDictionary == 'summitDictionary')
        apiRef.current.setEditCellValue({ id, field: nameField, value: subektAutocompleteValue.id })
    }
  }

  const displayValue = row[displayField]
  let submitDisabled = !cityAutocompleteValue?.id
  const renderOption = (props, option, { selected }) => {
    const { key, ...optionProps } = props
    return (
      <MenuItem value={option.id} key={key} {...optionProps}>
        <ListItemText
          primary={option.name}
          sx={{ width: '100%', whiteSpace: 'normal' }}
          secondary={option.secondary}
        />
      </MenuItem>
    )
  }
  const renderInput = (params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />

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
              id='demo-simple-select'
              value={countryAutocompleteValue}
              inputValue={countryInputValue}
              size='small'
              // MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={renderInput}
              options={countryAutocompleteOptions}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                handleCountryChange(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setCountryInputValue(newInputValue)
              }}
              fullWidth
            />

            <Autocomplete
              id='demo-simple-select'
              value={okrugAutocompleteValue}
              inputValue={okrugInputValue}
              size='small'
              // MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={renderInput}
              options={okrugAutocompleteOptions}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                handleDistrictChange(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setOkrugInputValue(newInputValue)
              }}
              fullWidth
            />

            <Autocomplete
              id='summitDictionary-select'
              value={subektAutocompleteValue}
              inputValue={subektInputValue}
              size='small'
              // MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={renderInput}
              options={subektAutocompleteOptions}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                handleSubektChange(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setSubektInputValue(newInputValue)
              }}
              fullWidth
              renderOption={renderOption}
            />

            <Autocomplete
              id='routeDictionary-select'
              value={cityAutocompleteValue}
              inputValue={cityInputValue}
              size='small'
              // MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
              options={cityAutocompleteOptions}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setCityAutocompleteValue(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setCityInputValue(newInputValue)
              }}
              fullWidth
              renderOption={renderOption}
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
