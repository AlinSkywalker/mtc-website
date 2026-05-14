import React from 'react'

import { useIsMobile } from '../hooks/useIsMobile'
import { MembershipApplicationListTable } from '../components/tables/MembershipApplicationListTable'
import { MobileMembershipApplicationListTable } from '../components/tables/MobileMembershipApplicationListTable'

export const MembershipApplicationListPage = () => {
  const isMobile = useIsMobile()
  if (isMobile) return <MobileMembershipApplicationListTable />

  return <MembershipApplicationListTable />
}
