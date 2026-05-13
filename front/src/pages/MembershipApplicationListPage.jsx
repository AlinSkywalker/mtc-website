import React from 'react'

// import { useIsMobile } from '../hooks/useIsMobile'
import { MembershipApplicationListTable } from '../components/tables/MembershipApplicationListTable'

export const MembershipApplicationListPage = () => {
  // const isMobile = useIsMobile()
  // if (isMobile) return <MobileEventListTable readOnly={false} />

  return <MembershipApplicationListTable />
}
