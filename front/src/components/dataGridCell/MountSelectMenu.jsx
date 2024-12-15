import React, { useEffect, useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useFetchDictionaryByName } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'
import CreateIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'

function mapDictionaryData(dictionaryName, dictionaryData = []) {
  return dictionaryData.map((item) => {
    let itemName = ''
    let parentId = ''
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
        break
      case 'routeDictionary':
        itemName = item.rout_name
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
    return { id: item.id, name: itemName, parentId }
  })
}

export function MountSelectMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const { id, row } = props
  const { region_name, rai_reg, rai_name, mount_rai, mount_name, rout_mount } = row
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

  const regionMappedData = mapDictionaryData('regionDictionary', regionData)
  const districtMappedData = mapDictionaryData('districtDictionary', districtData)
  const summitMappedData = mapDictionaryData('summitDictionary', summitData)

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

  useEffect(() => {
    setRegionAutocompleteOptions(regionMappedData)
  }, [regionData])

  useEffect(() => {
    let newDistrictData = districtMappedData
    if (rai_reg) {
      newDistrictData = newDistrictData.filter((item) => item.parentId == rai_reg)
    }
    setDistrictAutocompleteOptions(newDistrictData)
  }, [districtData])

  useEffect(() => {
    let newSummitData = summitMappedData
    if (mount_rai) {
      newSummitData = newSummitData.filter((item) => item.parentId == mount_rai)
    }
    setSummitAutocompleteOptions(newSummitData)
  }, [summitData])

  const handleRegionChange = (newValue) => {
    setRegionAutocompleteValue(newValue)

    setDistrictAutocompleteValue({ name: '', id: '', parentId: '' })
    setDistrictInputValue('')

    setSummitAutocompleteValue({ name: '', id: '', parentId: '' })
    setSummitInputValue('')

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

    setSummitAutocompleteOptions(
      newValue ? summitMappedData.filter((item) => item.parentId == newValue.id) : summitMappedData,
    )
  }

  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const handleSubmit = () => {
    handleClose()
    apiRef.current.setEditCellValue({
      id,
      field: 'region_name',
      value: regionAutocompleteValue.name,
    })
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
    apiRef.current.setEditCellValue({ id, field: 'rout_mount', value: summitAutocompleteValue.id })
    apiRef.current.setEditCellValue({
      id,
      field: 'mount_name',
      value: summitAutocompleteValue.name,
    })
  }
  return (
    <>
      <Grid2 container sx={{ width: '100%' }} flexWrap={'nowrap'}>
        <Grid2 item flexGrow={2} sx={{ pl: 2, overflow: 'hidden' }}>
          {mount_name}
        </Grid2>
        <Grid2 item flexShrink={0}>
          <IconButton onClick={handleClick}>
            <CreateIcon />
          </IconButton>
        </Grid2>
      </Grid2>

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
          <Grid2 container flexDirection={'column'} spacing={2}>
            <Autocomplete
              id='demo-simple-select'
              value={regionAutocompleteValue}
              inputValue={regionInputValue}
              size='small'
              MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
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
            <Autocomplete
              id='demo-simple-select'
              value={districtAutocompleteValue}
              inputValue={districtInputValue}
              size='small'
              MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
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
            <Autocomplete
              id='demo-simple-select'
              value={summitAutocompleteValue}
              inputValue={summitInputValue}
              size='small'
              MenuProps={{ sx: { maxWidth: 800 } }}
              renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
              options={summitAutocompleteOptions}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSummitAutocompleteValue(newValue)
              }}
              onInputChange={(event, newInputValue) => {
                setSummitInputValue(newInputValue)
              }}
              fullWidth
            />
            <Button
              onClick={handleSubmit}
              disabled={!summitAutocompleteValue.id}
              variant='contained'
            >
              Выбрать
            </Button>
          </Grid2>
        </Box>
      </Popover>
    </>
  )
}
