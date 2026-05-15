import React, { useContext } from 'react'

import { Typography, Grid, Container, Button } from '@mui/material'
import { useFetchMinutesOfMeetings } from '../queries/minutesOfMeetings'
import apiClient from '../api/api'
import { AuthContext } from '../components/AuthContext'

export const MinutesOfMeetingPage = () => {
  const { data } = useFetchMinutesOfMeetings()

  const handleDownloadFile = (id) => async () => {
    const downloadPath = `/api/minutesOfMeetings/file/${id}`
    const response = await apiClient.get(downloadPath, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    let fileName = response.headers['content-disposition'].split("filename*=UTF-8''")[1]
    if (fileName) {
      fileName = decodeURIComponent(fileName)
    } else {
      fileName = response.headers['content-disposition'].split('filename=')[1]
    }
    fileName = fileName.replaceAll('"', '')
    const link = document.createElement('a')
    link.href = url

    link.setAttribute('download', fileName) // Specify the filename here
    document.body.appendChild(link)
    link.click()
  }
  const renderItem = (
    /** @type {{ id: number; file_title: string ; file_path: string }} */ item,
  ) => {
    return (
      <Grid key={item.id} sx={{ mb: 1 }}>
        <Typography variant='h5' fontWeight={600}>
          {item.file_title}
        </Typography>
        <Button onClick={handleDownloadFile(item.id)} variant='contained'>
          Скачать
        </Button>
      </Grid>
    )
  }

  const {
    userInfo: { isClubMember },
  } = useContext(AuthContext)

  if (!isClubMember) return null

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: '#fff',
        border: '1px solid transparent',
      }}
    >
      <Grid container justifyContent={'center'} sx={{ m: 2 }}>
        <Typography variant='h4' alignContent={'center'}>
          Протоколы собраний
        </Typography>
      </Grid>

      {data?.map(renderItem)}
    </Container>
  )
}
