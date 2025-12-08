import React from 'react'
import { MemberAscentTab } from '../components/memberTabs/MemberAscentTab'
import { MemberLabaAscentTab } from '../components/memberTabs/MemberLabaAscentTab'
import { MemberExamTab } from '../components/memberTabs/MemberExamTab'
import { MemberSportCategoryTab } from '../components/memberTabs/MemberSportCategoryTab'
import { MemberEventTab } from '../components/memberTabs/MemberEventTab'

export const useGetProfileTabs = (currentMemberId) => {
  return [
    {
      name: 'ascents',
      label: 'Восхождения',
      component: <MemberAscentTab memberId={currentMemberId} />,
    },
    {
      name: 'labaAscents',
      label: 'Тренировки',
      component: <MemberLabaAscentTab memberId={currentMemberId} />,
    },
    {
      name: 'exam',
      label: 'Зачеты',
      component: <MemberExamTab memberId={currentMemberId} />,
    },
    {
      name: 'sportCategory',
      label: 'Разряды/Категории',
      component: <MemberSportCategoryTab memberId={currentMemberId} />,
    },
    {
      name: 'event',
      label: 'Мероприятия',
      component: <MemberEventTab memberId={currentMemberId} />,
    },
  ]
}
