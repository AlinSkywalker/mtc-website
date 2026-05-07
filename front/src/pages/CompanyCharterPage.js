import { Container, Grid, styled, Typography } from '@mui/material'
import React from 'react'
import { useFetchCompanyData } from '../queries/companyData'
import parse from 'html-react-parser'

const GridStyled = styled(Grid)`
  & .final_part {
    white-space: pre-wrap;
  }
`
export const CompanyCharterPage = () => {
  const { data } = useFetchCompanyData()

  const companyCharterHtml = parse(data?.company_charter || '')

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
          УCTAB
        </Typography>
        <Typography variant='h4' alignContent={'center'}>
          MФСОО «Центр альпинистской подготовки»
        </Typography>
      </Grid>
      <GridStyled>{companyCharterHtml}</GridStyled>
    </Container>
  )
}
