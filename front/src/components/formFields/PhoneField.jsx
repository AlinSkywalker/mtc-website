import React, { forwardRef } from 'react'
import TextField from '@mui/material/TextField'
// import { makeStyles } from '@mui/material/styles'
// const useStyles = makeStyles(theme => ({
//   input: {
//     backgroundColor: '#fff'
//   }
// }))
export const PhoneField = forwardRef(function PhoneField(props, ref) {
  // const classes = useStyles()
  return (
    <TextField
      {...props}
      // InputProps={{
      //   className: classes.input
      // }}
      inputRef={ref}
      fullWidth
      // label={props.label}
      variant='outlined'
    // name={props.name}
    />
  )
})
// export default forwardRef(phoneInput)
