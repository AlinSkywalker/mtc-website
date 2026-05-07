import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import apiClient from '../api/api'
import MtcImage from '../assets/mtc.png'
import './AdminLayoutStyles.css'
import { Grid, Box, Toolbar, AppBar, Typography } from '@mui/material'
import { AppToolbarProfileMenu } from './AppToolbarProfileMenu'
import { AppToolbarMainMenuMobile } from './AppToolbarMainMenuMobile'

export const AppToolbar = ({ children, pages, withProfile }) => {
  const { setUserInfo, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.get('/api/current').then((response) => {
        setUserInfo({
          id: response.data.id,
          role: response.data.role,
          memberId: response.data.memberId,
        })
      })
    }
  }, [isAuthenticated])

  const navigate = useNavigate()

  const handleGoToMainPage = () => {
    navigate('/')
  }

  return (
    <AppBar position='fixed'>
      <Toolbar className='AppBarToolbar'>
        <Grid onClick={handleGoToMainPage} sx={{ cursor: 'pointer' }}>
          <img src={MtcImage} alt='ЦАП' height='55px' />
          <Typography variant='h1' sx={{ display: 'none' }}>
            ЦАП — Центр альпинистской подготовки | Обучение альпинизму
          </Typography>
        </Grid>
        <Box sx={{ flexGrow: 1, display: 'flex', marginLeft: 3 }}>{children}</Box>
        <AppToolbarMainMenuMobile pages={pages} />
        {withProfile && <AppToolbarProfileMenu />}
      </Toolbar>
    </AppBar>
  )
}
