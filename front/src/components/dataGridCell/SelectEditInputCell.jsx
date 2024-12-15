import React, { useState } from 'react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useFetchDictionaryByName } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'

function mapDictionaryData(dictionaryName, dictionaryData = []) {
  return dictionaryData.map((item) => {
    let itemName = ''

    switch (dictionaryName) {
      case 'regionDictionary':
        itemName = item.region_name
        break
      case 'cityDictionary':
        itemName = item.city_name
        break
      case 'districtDictionary':
        itemName = item.rai_name
        break
      case 'laboratoryDictionary':
        itemName = item.laba_name
        break
      case 'summitDictionary':
        itemName = item.mount_name
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
      case 'members':
        itemName = item.fio
        break
      case 'events':
        itemName = item.event_name
        break

      default:
        itemName = ''
        break
    }
    return { id: item.id, name: itemName, item }
  })
}

export function SelectEditInputCell(props) {
  const { id, value, field, hasFocus, dictionaryName, nameField, hook, hookParams, pickMap } = props
  // console.log('SelectEditInputCell props', props)
  const queryHook = hook ? hook : useFetchDictionaryByName
  const queryHookParams = hookParams ? hookParams : { dictionaryName, returnType: 'arrayType' }
  const { isLoading, data } = queryHook(queryHookParams)

  const [autocompleteValue, setAutocompleteValue] = useState({
    id: props.row[nameField] || '',
    name: value || '',
  })
  const [inputValue, setInputValue] = React.useState(value)

  const dictionaryData = mapDictionaryData(dictionaryName, data)
  // console.log('dictionaryData', dictionaryData)
  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const handleChange = (newValue) => {
    console.log('newValue', newValue)
    setAutocompleteValue(newValue)
    // children
    apiRef.current.setEditCellValue({ id, field, value: newValue?.name || '' })
    apiRef.current.setEditCellValue({ id, field: nameField, value: newValue?.id || '' })
    if (pickMap) {
      Object.keys(pickMap).forEach((item) => {
        // apiRef.current.startCellEditMode({ id, field: item })
        apiRef.current.setEditCellValue({ id, field: item, value: newValue?.item?.[item] })
        // apiRef.current.stopCellEditMode({ id, field: item })
      })
    }
  }

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector(`input[value="${value}"]`)
      input?.focus()
    }
  }, [hasFocus, value])

  return (
    <Autocomplete
      id='demo-simple-select'
      value={autocompleteValue}
      inputValue={inputValue}
      // onChange={handleChange}
      size='small'
      MenuProps={{ sx: { maxWidth: 800 } }}
      renderInput={(params) => <TextField {...params} sx={{ height: 36, fontSize: 14 }} />}
      options={dictionaryData}
      getOptionLabel={(option) => option.name}
      onChange={(event, newValue) => {
        console.log('newValue', newValue)
        handleChange(newValue)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      fullWidth
    />
  )
}
