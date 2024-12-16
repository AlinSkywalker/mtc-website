import React from 'react'
import { DataGrid, useGridApiContext, GridCellEditStopReasons } from '@mui/x-data-grid'
import InputBase from '@mui/material/InputBase'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'

function EditTextarea(props) {
  const { id, field, value, colDef, hasFocus } = props
  const [valueState, setValueState] = React.useState(value)
  const [anchorEl, setAnchorEl] = React.useState()
  const [inputRef, setInputRef] = React.useState(null)
  const apiRef = useGridApiContext()

  React.useLayoutEffect(() => {
    if (hasFocus && inputRef) {
      inputRef.focus()
    }
  }, [hasFocus, inputRef])

  const handleRef = React.useCallback((el) => {
    setAnchorEl(el)
  }, [])

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value
      setValueState(newValue)
      apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 }, event)
    },
    [apiRef, field, id],
  )

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: colDef.computedWidth,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement='bottom-start'>
          <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
            <InputBase
              multiline
              rows={4}
              value={valueState}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              onChange={handleChange}
              inputRef={(ref) => setInputRef(ref)}
            />
          </Paper>
        </Popper>
      )}
    </div>
  )
}

export const multilineColumnType = {
  type: 'string',
  renderEditCell: (params) => <EditTextarea {...params} />,
}
