import React from 'react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useFetchDictionaryByName } from '../../queries/dictionary'
import { useGridApiContext } from '@mui/x-data-grid'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Grid2 from '@mui/material/Grid2'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  sx: { maxWidth: 800 },
}

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

export function MultiValueSelectEditInputCellNew(props) {
  const {
    id,
    value,
    field,
    hasFocus,
    dictionaryName,
    nameListField,
    idListField,
    row,
    displayNameField,
    hook,
    hookParams,
    nameField,
    secondarySourceField,
  } = props

  const queryHook = hook ? hook : useFetchDictionaryByName
  const queryHookParams = hookParams ? hookParams : { dictionaryName, returnType: 'arrayType' }

  const { isLoading, data } = queryHook(queryHookParams)

  const dictionaryData = mapDictionaryData(dictionaryName, data)
  // const nameList = row[nameListField]
  // const idList = row[idListField]
  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  // const [personName, setPersonName] = React.useState(nameList)
  // const [personId, setPersonId] = React.useState(idList)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    const newPersonName = value.map((item) => dictionaryData?.[item]?.name || '')
    apiRef.current.setEditCellValue({ id, field, value: newPersonName })
    apiRef.current.setEditCellValue({ id, field: nameField, value: value || '' })
  }
  // const handleWriteToRow = () => {
  //   // children
  //   apiRef.current.setEditCellValue({ id, field: displayNameField, value: personName.join(', ') })
  //   apiRef.current.setEditCellValue({ id, field: nameListField, value: personName })
  //   apiRef.current.setEditCellValue({ id, field: idListField, value: personId })
  // }

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
        value={row[field]}
        onChange={handleChange}
        renderValue={(selected) => {
          return selected.map((item) => dictionaryData?.[item].name || '').join(', ')
        }}
        MenuProps={MenuProps}
        // multiple
        // onClose={handleWriteToRow}
      >
        {dictionaryData &&
          Object.values(dictionaryData).map((item, index) => {
            return (
              <MenuItem value={item.id} key={index}>
                <ListItemText
                  primary={item.name}
                  sx={{ width: '100%', whiteSpace: 'normal' }}
                  secondary={item.item[secondarySourceField]}
                />
              </MenuItem>
            )
          })}
      </Select>
    </FormControl>
  )
}
// word-wrap: break-word;
// white-space: normal;
// font-size: 13px;
// color: #666;
