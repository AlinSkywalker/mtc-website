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
      case 'regionDictionary':
        itemName = item.region_name
        break
      case 'cityDictionary':
        itemName = item.city_name
        break
      case 'districtDictionary':
        itemName = item.rai_name
        parentId = item.rai_reg
        break
      case 'laboratoryDictionary':
        itemName = item.laba_name
        break
      case 'summitDictionary':
        itemName = item.mount_name
        parentId = item.mount_rai
        secondary = `${item.mount_height} м`
        break
      case 'routeDictionary':
        itemName = item.rout_name
        parentId = item.rout_mount
        secondary = `КС: ${item.rout_comp}`
        break
      case 'contractorDictionary':
        itemName = item.cont_fio
        break
      case 'baseDictionary':
        itemName = item.base_name
        break

      default:
        itemName = ''
        break
    }
    return { id: item.id, name: itemName, parentId, secondary }
  })
}

export function EditCascadeSelectMenu(props) {
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
  const { data: regionData } = useFetchDictionaryByName({
    dictionaryName: 'regionDictionary',
    returnType: 'arrayType',
  })
  const { data: districtData } = useFetchDictionaryByName({
    dictionaryName: 'districtDictionary',
    returnType: 'arrayType',
  })
  const { data: summitData } = useFetchDictionaryByName({
    dictionaryName: 'summitDictionary',
    returnType: 'arrayType',
  })
  const { data: routeData } = useFetchDictionaryByName({
    dictionaryName: 'routeDictionary',
    returnType: 'arrayType',
  })

  const regionMappedData = mapDictionaryData('regionDictionary', regionData)
  const districtMappedData = mapDictionaryData('districtDictionary', districtData)
  const summitMappedData = mapDictionaryData(
    'summitDictionary',
    fixedDistrict
      ? summitData?.filter((item) => fixedDistrict.includes(item.mount_rai))
      : summitData,
  )
  const routeMappedData = mapDictionaryData('routeDictionary', routeData)

  const [regionAutocompleteOptions, setRegionAutocompleteOptions] = useState(regionMappedData)
  const [regionAutocompleteValue, setRegionAutocompleteValue] = useState({
    id: rai_reg || '',
    name: region_name || '',
    parentId: '',
  })
  const [regionInputValue, setRegionInputValue] = React.useState(region_name)

  const [districtAutocompleteOptions, setDistrictAutocompleteOptions] = useState(districtMappedData)
  const [districtAutocompleteValue, setDistrictAutocompleteValue] = useState({
    id: mount_rai || '',
    name: rai_name || '',
    parentId: rai_reg || '',
  })
  const [districtInputValue, setDistrictInputValue] = React.useState(rai_name)

  const [summitAutocompleteOptions, setSummitAutocompleteOptions] = useState(summitMappedData)
  const [summitAutocompleteValue, setSummitAutocompleteValue] = useState({
    id: rout_mount || '',
    name: mount_name || '',
    parentId: mount_rai || '',
  })
  const [summitInputValue, setSummitInputValue] = React.useState(mount_name)

  const [routeAutocompleteOptions, setRouteAutocompleteOptions] = useState(routeMappedData)
  const [routeAutocompleteValue, setRouteAutocompleteValue] = useState({
    id: id || '',
    name: rout_name || '',
    parentId: rout_mount || '',
  })
  const [routeInputValue, setRouteInputValue] = React.useState(rout_name)

  useEffect(() => {
    setRegionAutocompleteOptions(regionMappedData)
  }, [regionData])

  useEffect(() => {
    let newDistrictData = districtMappedData
    if (regionAutocompleteValue.id) {
      newDistrictData = newDistrictData.filter((item) => item.parentId == regionAutocompleteValue.id)
    }
    setDistrictAutocompleteOptions(newDistrictData)
  }, [districtData, regionAutocompleteValue.id])

  useEffect(() => {
    let newSummitData = summitMappedData
    if (districtAutocompleteValue.id) {
      newSummitData = newSummitData.filter((item) => item.parentId == districtAutocompleteValue.id)
    }
    setSummitAutocompleteOptions(newSummitData)
  }, [summitData, districtAutocompleteValue.id])

  useEffect(() => {
    let newRouteData = routeMappedData
    if (summitAutocompleteValue.id) {
      newRouteData = newRouteData.filter((item) => item.parentId == summitAutocompleteValue.id)
    }
    setRouteAutocompleteOptions(newRouteData)
  }, [routeData, summitAutocompleteValue.id])

  const handleRegionChange = (newValue) => {
    setRegionAutocompleteValue(newValue)

    setDistrictAutocompleteValue({ name: '', id: '', parentId: '' })
    setDistrictInputValue('')

    setSummitAutocompleteValue({ name: '', id: '', parentId: '' })
    setSummitInputValue('')

    setRouteAutocompleteValue({ name: '', id: '', parentId: '' })
    setRouteInputValue('')

    setDistrictAutocompleteOptions(
      newValue
        ? districtMappedData.filter((item) => item.parentId == newValue.id)
        : districtMappedData,
    )
  }

  const handleDistrictChange = (newValue) => {
    setDistrictAutocompleteValue(newValue)

    setSummitAutocompleteValue({ name: '', id: '', parentId: '' })
    setSummitInputValue('')

    setRouteAutocompleteValue({ name: '', id: '', parentId: '' })
    setRouteInputValue('')

    setSummitAutocompleteOptions(
      newValue ? summitMappedData.filter((item) => item.parentId == newValue.id) : summitMappedData,
    )
  }

  const handleSummitChange = (newValue) => {
    setSummitAutocompleteValue(newValue)

    setRouteAutocompleteValue({ name: '', id: '', parentId: '' })
    setRouteInputValue('')
    setRouteAutocompleteOptions(
      newValue ? routeMappedData.filter((item) => item.parentId == newValue.id) : routeMappedData,
    )
  }

  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const handleSubmit = () => {
    handleClose()

    apiRef.current.setEditCellValue({ id, field: 'rai_reg ', value: regionAutocompleteValue.id })
    apiRef.current.setEditCellValue({
      id,
      field: 'region_name',
      value: regionAutocompleteValue.name,
    })

    apiRef.current.setEditCellValue({ id, field: 'mount_rai', value: districtAutocompleteValue.id })
    apiRef.current.setEditCellValue({
      id,
      field: 'rai_name',
      value: districtAutocompleteValue.name,
    })
    if (finishDictionary == 'routeDictionary' || finishDictionary == 'summitDictionary') {
      apiRef.current.setEditCellValue({
        id,
        field: 'rout_mount',
        value: summitAutocompleteValue.id,
      })
      apiRef.current.setEditCellValue({
        id,
        field: 'mount_name',
        value: summitAutocompleteValue.name,
      })
    }
    if (finishDictionary == 'routeDictionary') {
      apiRef.current.setEditCellValue({ id, field: 'asc_route', value: routeAutocompleteValue.id })
      apiRef.current.setEditCellValue({
        id,
        field: 'rout_name',
        value: routeAutocompleteValue.name,
      })
    }
    if (nameField) {
      if (finishDictionary == 'districtDictionary')
        apiRef.current.setEditCellValue({
          id,
          field: nameField,
          value: districtAutocompleteValue.id,
        })
      if (finishDictionary == 'routeDictionary')
        apiRef.current.setEditCellValue({ id, field: nameField, value: routeAutocompleteValue.id })
      if (finishDictionary == 'summitDictionary')
        apiRef.current.setEditCellValue({ id, field: nameField, value: summitAutocompleteValue.id })
    }
  }

  const displayValue = row[displayField]
  let submitDisabled = !districtAutocompleteValue?.id

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

  if (finishDictionary == 'routeDictionary') submitDisabled = !routeAutocompleteValue?.id
  else if (finishDictionary == 'summitDictionary') submitDisabled = !summitAutocompleteValue?.id
  return (
    <>
      <Grid container sx={{ width: '100%' }} flexWrap={'nowrap'} className='selectWithPopup'>
        <Grid flexGrow={2} sx={{ pl: 2, overflow: 'hidden' }}>
          {displayValue}
        </Grid>
        <Grid flexShrink={0}>
          <IconButton onClick={handleClick}>
            <CreateIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* <Button aria-describedby={'summit-select-button'} variant='contained' onClick={handleClick}>
        Open Popover
      </Button> */}
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
            {!fixedDistrict && (
              <Autocomplete
                id='demo-simple-select'
                value={regionAutocompleteValue}
                inputValue={regionInputValue}
                size='small'
                MenuProps={{ sx: { maxWidth: 800 } }}
                renderInput={renderInput}
                options={regionAutocompleteOptions}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  handleRegionChange(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setRegionInputValue(newInputValue)
                }}
                fullWidth
              />
            )}
            {!fixedDistrict && (
              <Autocomplete
                id='demo-simple-select'
                value={districtAutocompleteValue}
                inputValue={districtInputValue}
                size='small'
                MenuProps={{ sx: { maxWidth: 800 } }}
                renderInput={renderInput}
                options={districtAutocompleteOptions}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  handleDistrictChange(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setDistrictInputValue(newInputValue)
                }}
                fullWidth
              />
            )}
            {(finishDictionary == 'routeDictionary' || finishDictionary == 'summitDictionary') && (
              <Autocomplete
                id='summitDictionary-select'
                value={summitAutocompleteValue}
                inputValue={summitInputValue}
                size='small'
                MenuProps={{ sx: { maxWidth: 800 } }}
                renderInput={renderInput}
                options={summitAutocompleteOptions}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  handleSummitChange(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setSummitInputValue(newInputValue)
                }}
                fullWidth
                renderOption={renderOption}
              />
            )}
            {finishDictionary == 'routeDictionary' && (
              <Autocomplete
                id='routeDictionary-select'
                value={routeAutocompleteValue}
                inputValue={routeInputValue}
                size='small'
                MenuProps={{ sx: { maxWidth: 800 } }}
                renderInput={renderInput}
                options={routeAutocompleteOptions}
                getOptionLabel={(option) =>
                  option.secondary ? `${option.name} (${option.secondary})` : option.name
                }
                onChange={(event, newValue) => {
                  setRouteAutocompleteValue(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setRouteInputValue(newInputValue)
                }}
                fullWidth
                renderOption={renderOption}
              />
            )}
            <Button onClick={handleSubmit} disabled={submitDisabled} variant='contained'>
              Выбрать
            </Button>
          </Grid>
        </Box>
      </Popover>
    </>
  )
}
