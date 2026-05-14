import React, { useContext, useState } from 'react'
import { Button, Grid, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMembershipApplicationList } from '../../queries/membershipApplication'
import { AuthContext } from '../AuthContext'

const defaultItem = {
  fio: '',
}

export const MembershipApplicationListTable = () => {
  const { isLoading, data } = useFetchMembershipApplicationList()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    userInfo: { memberId },
  } = useContext(AuthContext)

  const handleClickName = (id) => () => {
    navigate(`/crm/member/${id}`)
  }

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/applicationList/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['applicationList'] })
    })
  }

  const renderMemberLink = (params) => {
    const link = params.value ?? ''

    return (
      <Link onClick={handleClickName(params.row.member_id)} sx={{ cursor: 'pointer' }}>
        {link}
      </Link>
    )
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

  const handleConfirmPayment = (id) => () => {
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

  const renderAcceptButtonCell = (params) => {
    const buttonElement = React.useRef(null)

    if (params.row.status === 'Новая' && !params.row.voting_results?.[memberId]) {
      return (
        <Grid
          container
          alignItems={'center'}
          sx={{ height: '100%', width: '100%' }}
          justifyContent='center'
        >
          <Button
            size='small'
            variant='contained'
            onClick={handleVote(params.row.id, 'yes')}
            ref={buttonElement}
            sx={{ mr: 2 }}
            disabled={isVoting}
          >
            ЗА
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={handleVote(params.row.id, 'no')}
            ref={buttonElement}
            disabled={isVoting}
          >
            ПРОТИВ
          </Button>
        </Grid>
      )
    }
  }

  const renderConfirmPaymentButtonCell = (params) => {
    const buttonElement = React.useRef(null)

    if (params.row.payment_confirmed !== 1) {
      return (
        <Button
          size='small'
          variant='contained'
          onClick={handleConfirmPayment(params.row.id)}
          ref={buttonElement}
          disabled={isVoting}
        >
          Подтвердить оплату
        </Button>
      )
    }
  }

  const columns = [
    {
      field: 'created_date',
      ...dateColumnType,
      headerName: 'Дата',
      width: 150,
      editable: true,
    },
    {
      field: 'fio',
      headerName: 'ФИО',
      width: 250,
      renderCell: renderMemberLink,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Статус заявки',
      width: 250,
      editable: true,
    },
    {
      field: 'vote',
      headerName: 'Голосование',
      width: 225,
      renderCell: renderAcceptButtonCell,
    },
    {
      field: 'confirm_payment',
      headerName: '',
      width: 202,
      renderCell: renderConfirmPaymentButtonCell,
    },
  ]
  const fieldToFocus = 'event_name'
  const columnVisibilityModel = {
    memb_city: false,
  }

  const processRowUpdate = async (newRow) => { }

  return (
    <EditableTable
      rows={rows}
      setRows={setRows}
      rowModesModel={rowModesModel}
      setRowModesModel={setRowModesModel}
      columns={columns}
      processRowUpdate={processRowUpdate}
      fieldToFocus={fieldToFocus}
      columnVisibilityModel={columnVisibilityModel}
      defaultItem={defaultItem}
      isLoading={isLoading}
      handleDeleteItem={handleDeleteItem}
      readOnly
    />
  )
}
