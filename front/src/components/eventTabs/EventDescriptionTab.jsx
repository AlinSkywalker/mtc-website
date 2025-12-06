import React, { useState } from 'react'
import { useFetchEvent, useFetchEventMemberList } from '../../queries/event'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useFetchMemberList } from '../../queries/member'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { Button, Card, Grid, Link } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { GridEditInputCell } from '@mui/x-data-grid'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'
import { fileColumnType } from '../dataGridCell/GridEditFileCell'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useIsMobile } from '../../hooks/useIsMobile'
import { EventInfoFormRO } from '../EventInfoFormRO'
import { EventInfoForm } from '../EventInfoForm'
import { EventBaseTable } from '../tables/EventBaseTable'
import { EventApplicationDialog } from '../dialogs/EventApplicationDialog'

export const EventDescriptionTab = ({ eventId }) => {
  const readOnly = !useIsAdmin()
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const params = useParams()
  const { id: currentId } = params
  const { isLoading, data } = useFetchEvent(currentId)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)

  if (!eventId) return null
  // if (isMobile) return <MobileEventDescriptionTab event={data} />

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
        <EventInfoFormRO eventData={data} isLoading={isLoading} />
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
