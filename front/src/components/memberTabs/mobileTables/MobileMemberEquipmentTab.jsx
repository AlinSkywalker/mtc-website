import React, { useState } from 'react'

import {
  Card,
  CircularProgress,
  Container,
  Grid,
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
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import apiClient from '../../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { AddEquipmentDialog } from './AddEquipmentDialog'

export const MobileMemberEquipmentTab = ({ isLoading, data, readOnly, memberId }) => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [expandedItemId, setExpandedItemId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [menuItem, setMenuItem] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)

  if (isLoading)
    return (
      <Container
        maxWidth={false}
        sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
      >
        <CircularProgress />
      </Container>
    )

  const handleDeleteClick = (id) => () => {
    setMenuAnchorEl(null)
    setDeleteItemId(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    const id = deleteItemId
    apiClient.delete(`/api/memberList/${memberId}/equipment/${id}`).then(() => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'equipment'] })
      enqueueSnackbar('Снаряжение удалено', { variant: 'success' })
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

  const renderItem = (item) => {
    const isExpanded = item.id === expandedItemId
    const { stor_name, equip_type, equip_name, quantity, loss } = item

    return (
      <Card
        sx={{ margin: '12px 0', padding: 1.5, position: 'relative' }}
        onClick={() => setExpandedItemId(isExpanded ? '' : item.id)}
        key={item.id}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant='h5' sx={{ fontSize: '19px' }}>
              {equip_type}, {equip_name}
            </Typography>
            <Typography>
              <b>Количество:</b> {quantity}
            </Typography>
          </Box>
          {!readOnly && (
            <IconButton size='small' onClick={(e) => handleOpenMenu(e, item)} sx={{ ml: 1 }}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
        {isExpanded && (
          <>
            <Typography>
              <b>Склад:</b> {stor_name}
            </Typography>
            <Typography>
              <b>Утеряно:</b> {loss ? 'Да' : 'Нет'}
            </Typography>
          </>
        )}
      </Card>
    )
  }

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
        {!readOnly && (
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Добавить
          </Button>
        )}
      </Box>
      <Grid container sx={{ position: 'relative', minHeight: '100px', backgroundColor: '#fff' }}>
        <Grid size={12}>{data?.map(renderItem)}</Grid>
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

      <AddEquipmentDialog
        memberId={memberId}
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
