import React from 'react'
import { useFetchMemberAscentChartList } from '../../queries/member'
import ReactECharts from 'echarts-for-react'
import { Grid } from '@mui/material'
import { ROUTE_COMP_ARRAY, ROUTE_COMP_ARRAY_COLORS } from '../../constants'

export const MemberChartsTab = ({ memberId }) => {
  const { isLoading, data } = useFetchMemberAscentChartList(memberId)

  // const echartsRef = useRef(null)

  // useEffect(() => {
  //   chartInstance = echartsRef.current.getEchartsInstance()

  //   // Дальнейшее управление

  //   // Например,  chartInstance.resize()
  // }, [])

  const ascentChartData =
    data?.map(([asc_date, route_comp]) => [
      Date.parse(asc_date),
      ROUTE_COMP_ARRAY.findIndex((item) => item === route_comp) + 1,
    ]) || []

  const ascentChartOption = {
    xAxis: {
      type: 'time',
      name: 'Дата',
      // min: '2025-09-01',
      // max: '2025-09-30',
      // nameLocation: 'center',
    },
    yAxis: {
      // type: 'category',
      // data: ROUTE_COMP_ARRAY,
      name: 'Категория',
    },
    visualMap: {
      type: 'piecewise',
      pieces: [
        { min: 1, max: 1, color: ROUTE_COMP_ARRAY_COLORS[0], label: '1Б' },
        { min: 2, max: 2, color: ROUTE_COMP_ARRAY_COLORS[1], label: '2А' },
        { min: 3, max: 3, color: ROUTE_COMP_ARRAY_COLORS[2], label: '2Б' },
        { min: 4, max: 4, color: ROUTE_COMP_ARRAY_COLORS[3], label: '3А' },
        { min: 5, max: 5, color: ROUTE_COMP_ARRAY_COLORS[4], label: '3Б' },
        { min: 6, max: 6, color: ROUTE_COMP_ARRAY_COLORS[5], label: '4А' },
        { min: 7, max: 7, color: ROUTE_COMP_ARRAY_COLORS[6], label: '4Б' },
        { min: 8, max: 8, color: ROUTE_COMP_ARRAY_COLORS[7], label: '5А' },
        { min: 9, max: 9, color: ROUTE_COMP_ARRAY_COLORS[8], label: '5Б' },
        { min: 10, max: 10, color: ROUTE_COMP_ARRAY_COLORS[9], label: '6А' },
        { min: 11, max: 11, color: ROUTE_COMP_ARRAY_COLORS[10], label: '6Б' },
      ],
      orient: 'horizontal',
      left: 'center',
      bottom: 20,
      showLabel: true,
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        // Красивый вывод при наведении
        const date = new Date(params.value[0]).toLocaleDateString('ru-RU')
        const category = params.value[1]
        return `Дата: ${date}<br/>Категория: ${ROUTE_COMP_ARRAY[category]}`
      },
    },
    series: [
      {
        data: ascentChartData,
        type: 'bar',
      },
    ],
  }

  if (!memberId) return null

  return (
    <Grid sx={{ backgroundColor: '#fff', height: 400 }}>
      <ReactECharts option={ascentChartOption} style={{ height: '400px' }} />
    </Grid>
  )
}
