import React from 'react'
import Grid from '@mui/material/Grid'
import { CircularProgress, IconButton, Popover, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useExternalFetchMember } from '../queries/member'

export const EventMemberPopover = ({ memberId, anchorEl, setAnchorEl, open }) => {
  const { data: memberData, isLoading } = useExternalFetchMember(memberId)

  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Grid container spacing={2} sx={{ p: 2, maxHeight: 350 }}>
        <img alt='' src={memberData?.member_photo} width='200' height='200' />
        <Grid sx={{ maxWidth: 400 }}>
          {isLoading && <CircularProgress />}
          {!isLoading && (
            <>
              {' '}
              <Typography sx={{ fontWeight: 'bold' }}>{memberData?.fio}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{memberData?.about_me}</Typography>
            </>
          )}
        </Grid>
        <Grid sx={{ width: 20 }}>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Popover>
  )
}
