import React, { useState } from 'react'
import { useFetchEvent } from '../../queries/event'
import { Button, Card, Grid } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useIsMobile } from '../../hooks/useIsMobile'
import { EventInfoRO } from '../EventInfoRO'
import { EventInfoForm } from '../EventInfoForm'
import { EventBaseTable } from '../tables/EventBaseTable'
import { EventApplicationDialog } from '../dialogs/EventApplicationDialog'

export const EventDescriptionTab = ({ eventId }) => {
  const readOnly = !useIsAdmin()
  const isMobile = useIsMobile()
  const params = useParams()
  const { id: currentId } = params
  const { isLoading, data } = useFetchEvent(currentId)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)

  if (!eventId) return null

  return (
    <Card sx={{ minWidth: 275 }}>
      <Grid sx={{ padding: 2 }}>
        {data.event_finish > new Date() && (
          <Button variant='contained' onClick={() => setIsApplicationDialogOpen(true)}>
            Подать заявку
          </Button>
        )}
      </Grid>
      {readOnly ? (
        <EventInfoRO eventData={data} isLoading={isLoading} />
      ) : (
        <Grid container spacing={2}>
          <Grid size={isMobile ? 12 : 10}>
            <Card sx={{ minWidth: 275 }}>
              <EventInfoForm eventData={data} isLoading={isLoading} readOnly={readOnly} />
            </Card>
          </Grid>
          <Grid size={isMobile ? 12 : 2}>
            <EventBaseTable eventId={currentId} readOnly={readOnly} />
          </Grid>
        </Grid>
      )}
      <EventApplicationDialog
        eventId={currentId}
        open={isApplicationDialogOpen}
        setOpen={setIsApplicationDialogOpen}
      />
    </Card>
  )
}
