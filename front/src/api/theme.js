import { createTheme } from '@mui/material/styles'
import { ruRU } from '@mui/x-data-grid/locales'
import { ruRU as coreruRU } from '@mui/material/locale'

const theme = createTheme(
  ruRU, // x-data-grid translations
  coreruRU, // core translations
)

export default theme
