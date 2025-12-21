import React, { useContext } from 'react'
import { useFetchMemberEquipmentList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useIsMobile } from '../../hooks/useIsMobile'
import { MobileMemberEquipmentTab } from './mobileTables/MobileMemberEquipmentTab'
import { AuthContext } from '../../components/AuthContext'
import { useFetchEquipmentTypeList, useFetchStorageList } from '../../queries/equipment'
import { SelectEditInputCell } from '../dataGridCell/SelectEditInputCell'
import { checkboxColumnType } from '../dataGridCell/GridEditCheckboxCell'
import { useIsAdmin } from '../../hooks/useIsAdmin'

const defaultItem = {
  equip_member: '',
  equip_name: '',
  equip: '',
  equip_type: '',
  equip_storage: '',
  equip_storage_name: '',
  loss: false,
  quantity: 1,
}

const validationSchema = Yup.object({
  equip_name: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberEquipmentTab = ({ memberId }) => {
  const {
    userInfo: { memberId: currentMemberId },
  } = useContext(AuthContext)
  const readOnly = memberId !== currentMemberId
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const isAdmin = useIsAdmin()
  const { isLoading, data } = useFetchMemberEquipmentList(memberId)

  const [rows, setRows] = React.useState(data)
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    setRows(data)
  }, [data])

  const handleSaveNewItem = (data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.put(`/api/memberList/${memberId}/equipment`, postedData)
  }

  const handleDeleteItem = (id) => () => {
    apiClient.delete(`/api/memberList/${memberId}/equipment/${id}`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId, 'equipment'] })
    })
  }

  const handleSaveEditedItem = React.useCallback((data) => {
    const { id, isNew, ...postedData } = data
    return apiClient.post(`/api/memberList/${memberId}/equipment/${id}`, postedData)
  }, [])

  const renderEquipmentTypeSelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='equipment_type'
        nameField='equip'
        hook={useFetchEquipmentTypeList}
      />
    )
  }
  const renderStorageSelectEditCell = (params) => {
    return (
      <SelectEditInputCell
        {...params}
        dictionaryName='storage'
        nameField='equip_storage'
        hook={useFetchStorageList}
      />
    )
  }

  const columns = [
    {
      field: 'stor_name',
      headerName: 'Склад',
      width: 300,
      renderEditCell: renderStorageSelectEditCell,
      editable: !readOnly,
    },
    {
      field: 'equip_type',
      headerName: 'Тип снаряжения',
      width: 300,
      renderEditCell: renderEquipmentTypeSelectEditCell,
      editable: !readOnly,
    },
    {
      field: 'equip_name',
      headerName: 'Название',
      width: 300,
      editable: !readOnly,
    },
    {
      field: 'quantity',
      headerName: 'Количество',
      width: 300,
      type: 'number',
      editable: !readOnly,
    },
    {
      field: 'loss',
      headerName: 'Утеряно',
      width: 300,
      editable: !readOnly,
      ...checkboxColumnType,
    },
    {
      field: 'equip',
      headerName: 'equip',
      width: 0,
      editable: !readOnly,
    },
    {
      field: 'equip_storage',
      headerName: 'equip_storage',
      width: 0,
      editable: !readOnly,
    },
  ]
  const fieldToFocus = 'equip_type'
  const columnVisibilityModel = {
    equip_storage: false,
    equip: false,
    stor_name: isAdmin ? true : false
  }

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['member', memberId, 'equipment'] })
  }

  if (!memberId) return null
  if (isMobile) return <MobileMemberEquipmentTab isLoading={isLoading} data={data} />

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
      // isCellEditable={(params) =>
      //   params.field !== 'fio' || (params.row.isNew && params.field == 'fio')
      // }
      readOnly={readOnly}
    />
  )
}
