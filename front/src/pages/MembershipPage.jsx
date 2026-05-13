import { Button, Container, Grid, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import MembershipQr from '../assets/membership_qr.jpg'
import apiClient from '../api/api'
import { useSnackbar } from 'notistack'
import { AuthContext } from '../components/AuthContext'

export const MembershipPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    userInfo: { isClubMember },
  } = useContext(AuthContext)

  const { enqueueSnackbar } = useSnackbar()

  const handleSubmitApplication = () => {
    setIsSubmitting(true)
    return apiClient
      .put(`/api/membershipApplication/`)
      .then((res) => {
        setIsSubmitting(false)
        enqueueSnackbar('Заявка успешно отправлена', {
          variant: 'success',
          autoHideDuration: 2000,
        })
      })
      .catch((error) => {
        setIsSubmitting(false)
        enqueueSnackbar(error.response.data.message, {
          variant: 'error',
          autoHideDuration: 2000,
        })
      })
  }
  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: '#fff',
        border: '1px solid transparent',
      }}
    >
      <Grid
        container
        justifyContent={'center'}
        sx={{ m: 2, textAlign: 'center' }}
        direction={'column'}
      >
        <Typography variant='h4' alignContent={'center'}>
          Вступление в клуб
        </Typography>
        <Typography variant='h5' alignContent={'center'}>
          «Центр альпинистской подготовки»
        </Typography>
      </Grid>
      <Grid>
        {isClubMember ? (
          <Typography variant='h6'>Для продления членства необходимо:</Typography>
        ) : (
          <Typography variant='h6'>Для вступления в клуб необходимо:</Typography>
        )}
        {!isClubMember && (
          <Grid sx={{ mb: 1, mt: 1 }}>
            <Typography>1. Подать заявку на вступление</Typography>
            <Button variant='contained' onClick={handleSubmitApplication} disabled={isSubmitting}>
              Подать заявку
            </Button>
          </Grid>
        )}
        <Grid sx={{ mb: 1 }}>
          <Typography>
            {isClubMember ? '1' : '2'}. Оплатить {isClubMember ? 'членский' : 'вступительный'} взнос
            переводом по реквизитам на расчетный счет MФСОО «Центр альпинистской подготовки»
          </Typography>
          <Typography>Реквизиты для оплаты:</Typography>
          <Typography>Наименование: МФСОО &quot;ЦЕНТР АЛЬПИНИСТСКОЙ ПОДГОТОВКИ&quot;</Typography>
          <Typography>ИНН: 2902093007</Typography>
          <Typography>КПП: 290201001</Typography>
          <Typography>ОГРН: 1262900001737</Typography>
          <Typography>Расчётный счёт: 40703810004710000262</Typography>
          <Typography>Банк: АРХАНГЕЛЬСКОЕ ОТДЕЛЕНИЕ N 8637 ПАО СБЕРБАНК</Typography>
          <Typography>БИК банка: 041117601</Typography>
          <Typography>Корсчёт: 30101810100000000601</Typography>
          <Typography>ИНН банка: 7707083893</Typography>
          <Typography>КПП банка: 290102001</Typography>
          <Typography>Назначение платежа: Членский взнос</Typography>
          <Typography>Сумма: 2000 рублей</Typography>
          <Typography>Можно оплатить отсканировав QR код в приложении банка</Typography>
          <img src={MembershipQr} alt='qr код' height='150px' width='150px' />
        </Grid>

        <Typography>
          {isClubMember ? '2' : '3'}. Уведомить Вещагина Михаила Александровича любым доступным
          способом (мессенджеры, почта) о совершении оплаты, прислав ему скрин, подтверждающий
          оплату.
        </Typography>
      </Grid>
    </Container>
  )
}
