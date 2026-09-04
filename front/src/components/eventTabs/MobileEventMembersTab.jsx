import React, { useState } from 'react'
import { useFetchEventMemberList } from '../../queries/event'
import {
  Card,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import IconButtonMui from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { red } from '@mui/material/colors'
import { format, parseISO } from 'date-fns'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { EventMemberDialog } from './EventMemberDialog'

export const MobileEventMembersTab = ({ eventId }) => {
  const { isLoading, data } = useFetchEventMemberList(eventId)
  const isAdmin = useIsAdmin()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [expandedItemId, setExpandedItemId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [menuItem, setMenuItem] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)

  const renderAlerts = (value) => {
    const alerts = value ?? []
    if (alerts.length !== 0) {
      const tooltipText = alerts.join(';\r\n')
      return (
        <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}>
          <IconButtonMui sx={{ color: red[500], mr: 0.5 }}>
            <ErrorIcon />
          </IconButtonMui>
        </Tooltip>
      )
    } else {
      return null
    }
  }

  const handleClickName = (id) => () => {
    navigate(`/crm/member/${id}`)
  }

  const handleDeleteClick = (id) => () => {
    setMenuAnchorEl(null)
    setDeleteItemId(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    const id = deleteItemId
    apiClient.delete(`/api/eventList/${eventId}/member/${id}`).then(() => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId, 'member'] })
      enqueueSnackbar('Участник удален', { variant: 'success' })
    })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setDeleteItemId(null)
  }

  const handleEdit = (item) => (event) => {
    event.stopPropagation()
    setMenuAnchorEl(null)
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleOpenMenu = (event, item) => {
    event.stopPropagation()
    setMenuItem(item)
    setMenuAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuAnchorEl(null)
    setMenuItem(null)
  }

  const getBoolText = (value) => {
    return value ? 'Да' : 'Нет'
  }

  const renderMemberItem = (memberItem) => {
    const memberStart = format(parseISO(memberItem.eventmemb_dates || ''), 'dd.MM.yyyy')
    const memberFinish = format(parseISO(memberItem.eventmemb_datef || ''), 'dd.MM.yyyy')
    const isExpanded = memberItem.id === expandedItemId

    const memberFio = (
      <Typography variant='h5' sx={{ fontSize: '19px' }}>
        {isAdmin && renderAlerts(memberItem.alerts)}
        {memberItem.fio}
      </Typography>
    )

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5, position: 'relative' }}
        onClick={() => setExpandedItemId(isExpanded ? '' : memberItem.id)}
        key={memberItem.id}
      >
        {isAdmin && (
          <IconButton
            size='small'
            onClick={(e) => handleOpenMenu(e, memberItem)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
        {isAdmin ? (
          <Link onClick={handleClickName(memberItem.eventmemb_memb)}>{memberFio}</Link>
        ) : (
          memberFio
        )}

        <Typography>
          {memberItem.eventmemb_role} (Разряд: {memberItem.ball})
        </Typography>
        <Typography>
          {memberStart} - {memberFinish}
        </Typography>
        {isExpanded && isAdmin && (
          <>
            <Typography>
              <b>Оплата:</b> {memberItem.eventmemb_pred}
            </Typography>
            <Typography>
              <b>Страховка:</b> {getBoolText(memberItem.eventmemb_nstrah)}
            </Typography>
            <Typography>
              <b>Справка:</b> {getBoolText(memberItem.eventmemb_nmed)}
            </Typography>
            <Typography>
              <b>Email:</b> {memberItem.memb_email}
            </Typography>
            <Typography>
              <b>Телефон:</b> {memberItem.tel_1}
            </Typography>
          </>
        )}
      </Card>
    )
  }

  if (!eventId) return null
  if (isLoading)
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1.5,
          backgroundColor: '#fff',
        }}
      >
        {isAdmin && (
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Добавить
          </Button>
        )}
      </Box>
      <Grid container sx={{ position: 'relative', minHeight: '100px', backgroundColor: '#fff' }}>
        <Grid size={12}>{data?.map(renderMemberItem)}</Grid>
      </Grid>

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEdit(menuItem)}>
          <ListItemIcon>
            <EditIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick(menuItem?.id)}>
          <ListItemIcon>
            <DeleteIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Удалить</ListItemText>
        </MenuItem>
      </Menu>

      <EventMemberDialog
        eventId={eventId}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditingItem(null)
        }}
        editingItem={editingItem}
      />

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Вы уверены?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить запись?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Нет</Button>
          <Button onClick={handleDeleteConfirm} variant='contained' color='error'>
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
