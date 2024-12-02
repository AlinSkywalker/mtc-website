import React from 'react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useFetchDictionaryByName } from '../queries/dictionary'
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

      default:
        itemName = ''
        break
    }
    return { id: item.id, name: itemName }
  })
}

export function SelectEditInputCell(props) {
  const { id, value, field, hasFocus, dictionaryName, nameField } = props
  // console.log('SelectEditInputCell props', props)
  const { isLoading, data } = useFetchDictionaryByName(dictionaryName)

  const dictionaryData = mapDictionaryData(dictionaryName, data)
  // console.log('dictionaryData', dictionaryData)
  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const handleChange = (event, newValue) => {
    // console.log('newValue', newValue)
    // children
    apiRef.current.setEditCellValue({ id, field, value: newValue.props.value })
    apiRef.current.setEditCellValue({ id, field: nameField, value: newValue.props.children })
  }

  useEnhancedEffect(() => {
    if (hasFocus && ref.current) {
      const input = ref.current.querySelector(`input[value="${value}"]`)
      input?.focus()
    }
  }, [hasFocus, value])

  return (
    <FormControl fullWidth variant='standard' sx={{ padding: '0 10px' }}>
      <Select
        id='demo-simple-select'
        value={value}
        onChange={handleChange}
        MenuProps={{ sx: { maxWidth: 800 } }}
      >
        <MenuItem value=''></MenuItem>
        {dictionaryData.map((item, index) => (
          <MenuItem value={item.id} key={index}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
