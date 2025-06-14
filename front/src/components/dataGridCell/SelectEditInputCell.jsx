import React, { useState } from 'react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useFetchDictionaryByName } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'
import { format } from 'date-fns'

function mapDictionaryData(
  dictionaryName,
  dictionaryData = [],
  secondarySource,
  secondarySourceArray = [],
) {
  return dictionaryData.map((item) => {
    let itemName = ''
    let secondary = ''
    if (secondarySourceArray.length != 0) {
      const secondareArray = secondarySourceArray.map(
        (secondarySourceItem) => item[secondarySourceItem],
      )
      secondary = secondareArray.join(', ')
    } else if (secondarySource) secondary = item[secondarySource]
    let id = item.id
    switch (dictionaryName) {
      case 'regionDictionary':
        itemName = item.region_name
        break
      case 'cityDictionary':
        itemName = item.name_city
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
        if (secondarySource == 'alprazr') secondary = `Разряд: ${secondary}`
        else if (secondarySource == 'alpinstr') secondary = `Инструктор: ${secondary} категории`
        break
      case 'events':
        itemName = item.event_name
        break
      case 'departMembers':
        id = item.member_id
        itemName = item.member_fio
        break
      case 'baseHouseDictionary':
        itemName = item.basefd_name
        break
      case 'baseHouseRoomDictionary':
        itemName = item.basenom_name
        break
      case 'department':
        itemName = `${item.depart_tip} ${item.depart_name}`
        if (secondarySource == 'date') {
          secondary = `${format(item.depart_dates, 'dd.MM')} - ${format(item.depart_datef, 'dd.MM')}`
        }
        break
      case 'subektDictionary':
        itemName = `${item.count_name}, ${item.okr_name}, ${item.sub_name}`
        break
      default:
        itemName = ''
        secondary = ''
        break
    }
    return { id, name: itemName, item, secondary }
  })
}

export function SelectEditInputCell(props) {
  const {
    id,
    value,
    field,
    hasFocus,
    dictionaryName,
    nameField,
    hook,
    hookParams,
    pickMap,
    secondarySource = '',
    secondarySourceArray = [],
    selectCallback,
  } = props
  const queryHook = hook ? hook : useFetchDictionaryByName
  const queryHookParams = hookParams ? hookParams : { dictionaryName, returnType: 'arrayType' }
  const { isLoading, data } = queryHook(queryHookParams)

  const [autocompleteValue, setAutocompleteValue] = useState({
    id: props.row[nameField] || '',
    name: value || '',
  })
  const [inputValue, setInputValue] = React.useState(value)

  const dictionaryData = mapDictionaryData(
    dictionaryName,
    data,
    secondarySource,
    secondarySourceArray,
  )
  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const handleChange = (newValue) => {
    setAutocompleteValue(newValue)
    // children
    apiRef.current.setEditCellValue({ id, field, value: newValue?.name || '' })
    apiRef.current.setEditCellValue({ id, field: nameField, value: newValue?.id || '' })
    if (pickMap) {
      Object.keys(pickMap).forEach((pickMapItem) => {
        // apiRef.current.startCellEditMode({ id, field: item })
        apiRef.current.setEditCellValue({
          id,
          field: pickMapItem,
          value: newValue?.item?.[pickMapItem],
        })
        // apiRef.current.stopCellEditMode({ id, field: item })
      })
    }
    if (selectCallback) {
      selectCallback(id, props.row, apiRef, newValue)
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
      getOptionLabel={(option) =>
        option.secondary ? `${option.name} (${option.secondary})` : option.name
      }
      onChange={(event, newValue) => {
        handleChange(newValue)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      fullWidth
      renderOption={(props, option, { selected }) => {
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
      }}
    />
  )
}
