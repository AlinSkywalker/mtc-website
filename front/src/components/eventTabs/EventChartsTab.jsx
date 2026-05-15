import React from 'react'
import { useFetchEventAscentChartData, useFetchEventMemberChartData } from '../../queries/event'

import ReactECharts from 'echarts-for-react'
import { Grid } from '@mui/material'
import { ROUTE_COMP_ARRAY, ROUTE_COMP_ARRAY_COLORS } from '../../constants'
import { pluralizeWord } from '../../utils/pluralizeWord'
import { useIsMobile } from '../../hooks/useIsMobile'
import { wrap } from 'lodash-es'

export const EventChartsTab = ({ eventId }) => {
  const isMobile = useIsMobile()
  const { isLoading, data: ascentChartData } = useFetchEventAscentChartData(eventId)
  const { data: memberChartData } = useFetchEventMemberChartData(eventId)

  const ascentChartSeriesData = ROUTE_COMP_ARRAY.map((rout_comp, index) => {
    return {
      value: ascentChartData?.find((item) => item.rout_comp === rout_comp)?.count || 0,
      itemStyle: {
        color: ROUTE_COMP_ARRAY_COLORS[index], // Цвет для этой категории
      },
    }
  })

  const option = {
    xAxis: {
      type: 'category',
      data: ROUTE_COMP_ARRAY,
      name: 'Категория',
      nameLocation: 'center',
    },
    yAxis: {
      type: 'value',
    },

    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        // Красивый вывод при наведении
        return `${params.value} ${pluralizeWord(params.value, ['восхождение', 'восхождения', 'восхождений'])}`
      },
    },
    series: [
      {
        data: ascentChartSeriesData,
        type: 'bar',
      },
    ],
  }

  const memberChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        // Красивый вывод при наведении
        return `${params.value} ${pluralizeWord(params.value, ['участник', 'участника', 'участников'])}`
      },
    },
    series: [
      {
        data: memberChartData,
        type: 'pie',
      },
    ],
  }

  if (!eventId) return null

  return (
    <Grid sx={{ backgroundColor: '#fff', height: 400 }} container flexWrap={'wrap'}>
      <Grid size={isMobile ? 12 : 6}>
        <ReactECharts option={option} style={{ height: '400px' }} />
      </Grid>
      <Grid size={isMobile ? 12 : 6}>
        <ReactECharts option={memberChartOption} style={{ height: '400px' }} />
      </Grid>
    </Grid>
  )
}
