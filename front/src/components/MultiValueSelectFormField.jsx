import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useFetchDictionaryByName } from '../queries/dictionary'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'

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

export function MultiValueSelectFormField(props) {
  const { dictionaryName, nameList, idList, onChange } = props
  const { isLoading, data: dictionaryData } = useFetchDictionaryByName({
    dictionaryName,
    returnType: 'objectType',
  })

  const [personName, setPersonName] = React.useState(nameList)
  const [personId, setPersonId] = React.useState(idList)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
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
  const handleWriteToField = () => {
    // children
    onChange(personId, personName)
  }

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
        onClose={handleWriteToField}
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
