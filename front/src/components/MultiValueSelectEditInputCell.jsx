import React from 'react'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useFetchDictionaryByName } from '../queries/dictionary'
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

export function MultiValueSelectEditInputCell(props) {
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
  } = props
  // console.log('SelectEditInputCell props', props)
  const { isLoading, data: dictionaryData } = useFetchDictionaryByName({
    dictionaryName,
    returnType: 'objectType',
  })
  // const dictionaryDataList

  // const dictionaryData = mapDictionaryData(dictionaryName, data)
  const nameList = row[nameListField]
  const idList = row[idListField]

  // console.log(nameList, idList)
  // console.log('dictionaryData', dictionaryData, dictionaryData && Object.entries(dictionaryData))
  const apiRef = useGridApiContext()
  const ref = React.useRef(null)

  const [personName, setPersonName] = React.useState(nameList)
  const [personId, setPersonId] = React.useState(idList)
  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    // console.log(event.target.value)
    const newPersonName = value.map((item) => dictionaryData?.[item]?.name || '')
    setPersonName(
      // On autofill we get a stringified value.
      newPersonName,
    )
    setPersonId(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }
  const handleWriteToRow = () => {
    // console.log('newValue', newValue)
    // children
    apiRef.current.setEditCellValue({ id, field: displayNameField, value: personName.join(', ') })
    apiRef.current.setEditCellValue({ id, field: nameListField, value: personName })
    apiRef.current.setEditCellValue({ id, field: idListField, value: personId })
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
        value={personId}
        onChange={handleChange}
        renderValue={(selected) => {
          return selected.map((item) => dictionaryData?.[item].name || '').join(', ')
        }}
        MenuProps={MenuProps}
        multiple
        onClose={handleWriteToRow}
      >
        {dictionaryData &&
          Object.values(dictionaryData).map((item, index) => {
            return (
              <MenuItem value={item.id} key={index}>
                <Checkbox checked={personId.includes(item.id)} sx={{ p: 0.5 }} />
                <ListItemText
                  primary={item.name}
                  sx={{ width: '100%', whiteSpace: 'normal' }}
                  secondary={item.cont_desc}
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
