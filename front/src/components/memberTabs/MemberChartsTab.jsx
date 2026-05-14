import React from 'react'
import { useFetchMemberAscentChartList } from '../../queries/member'
import { MobileMemberAscentTab } from './mobileTables/MobileMemberAscentTab'
import { useIsMobile } from '../../hooks/useIsMobile'
import ReactECharts from 'echarts-for-react'
import { Grid } from '@mui/material'
import { ROUTE_COMP_ARRAY } from '../../constants'

export const MemberChartsTab = ({ memberId }) => {
  const isMobile = useIsMobile()

  const { isLoading, data } = useFetchMemberAscentChartList(memberId)

  // const echartsRef = useRef(null)

  // useEffect(() => {
  //   chartInstance = echartsRef.current.getEchartsInstance()

  //   // Дальнейшее управление

  //   // Например,  chartInstance.resize()
  // }, [])

  const chartData =
    data?.map(([asc_date, route_comp]) => [
      Date.parse(asc_date),
      ROUTE_COMP_ARRAY.findIndex((item) => item === route_comp),
    ]) || []

  const option = {
    xAxis: {
      type: 'time',
      name: 'Дата восхождения',
    },
    yAxis: {
      type: 'category',
      data: ROUTE_COMP_ARRAY,
      name: 'Категория маршрута',
    },
    series: [
      {
        data: chartData,
        type: 'line',
      },
    ],
  }

  if (!memberId) return null
  if (isMobile) return <MobileMemberAscentTab isLoading={isLoading} data={data} />

  return (
    <Grid sx={{ backgroundColor: '#fff', height: 400 }}>
      <ReactECharts option={option} style={{ height: '400px' }} />
    </Grid>
  )
}
