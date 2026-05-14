import React, { useContext, useState } from 'react'
import { Button, Grid, Link, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { useFetchMembershipApplicationList } from '../../queries/membershipApplication'
import { AuthContext } from '../AuthContext'
import { MobileTableItem } from '../MobileTableItem'
import { format, parseISO } from 'date-fns'

export const MobileMembershipApplicationListTable = () => {
  const { isLoading, data } = useFetchMembershipApplicationList()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    userInfo: { memberId },
  } = useContext(AuthContext)

  const handleClickName = (/** @type {string} */ id) => () => {
    navigate(`/crm/member/${id}`)
  }

  const [isVoting, setIsVoting] = useState(false)

  const handleVote = (id, vote) => () => {
    setIsVoting(true)
    return apiClient
      .post(`/api/membershipApplication/${id}/vote/${vote}`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['membershipApplication'],
        })
        setIsVoting(false)
      })
      .catch(() => {
        setIsVoting(false)
      })
  }

  const handleConfirmPayment = (/** @type {string} */ id) => () => {
    setIsVoting(true)
    return apiClient
      .post(`/api/membershipApplication/${id}/confirmPayment`)
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: ['membershipApplication'],
        })
        setIsVoting(false)
      })
      .catch(() => {
        setIsVoting(false)
      })
  }

  const renderItem = (item) => {
    const applicationDate = format(parseISO(item.created_date || ''), 'dd.MM.yyyy')
    const isVoteEnabled = item.status === 'Новая' && !item.voting_results?.[memberId]

    return (
      <MobileTableItem id={item.id} key={item.id}>
        <Link onClick={handleClickName(item.member_id)}>
          <Typography variant='h5'>{item.fio}</Typography>
        </Link>

        <Typography>
          <b>Дата:</b> {applicationDate}
        </Typography>
        <Typography>
          <b>Статус:</b> {item.status}
        </Typography>
        <Grid
          container
          alignItems={'center'}
          sx={{ height: '100%', width: '100%' }}
          justifyContent='center'
        >
          <Button
            size='small'
            variant='contained'
            onClick={handleVote(item.id, 'yes')}
            sx={{ mr: 2 }}
            disabled={isVoting || !isVoteEnabled}
          >
            ЗА
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={handleVote(item.id, 'no')}
            disabled={isVoting || !isVoteEnabled}
            sx={{ mr: 2 }}
          >
            ПРОТИВ
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={handleConfirmPayment(item.id)}
            disabled={isVoting || item.payment_confirmed !== 1}
          >
            Подтвердить оплату
          </Button>
        </Grid>
      </MobileTableItem>
    )
  }

  return <Grid>{data?.map(renderItem)}</Grid>
}
