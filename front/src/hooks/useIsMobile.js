import { useMediaQuery } from 'react-responsive'

export const useIsMobile = () => {
  return useMediaQuery({ query: '(max-device-width: 768px)' })
}
