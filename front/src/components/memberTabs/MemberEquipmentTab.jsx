import React, { useContext } from 'react'
import { useFetchMemberEquipmentList } from '../../queries/member'
import apiClient from '../../api/api'
import { useQueryClient } from '@tanstack/react-query'
import { EditableTable } from '../EditableTable'
import * as Yup from 'yup'
import { dateColumnType } from '../dataGridCell/GridEditDateCell'
import { useIsMobile } from '../../hooks/useIsMobile'
import { MobileMemberExamTab } from './MobileMemberExamTab'
import { AuthContext } from '../../components/AuthContext'
import { useFetchEquipmentTypeList, useFetchStorageList } from '../../queries/equipment'

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
  zach_name: Yup.string().required('Поле обязательно для заполнения'),
  zach_grade: Yup.string().required('Поле обязательно для заполнения'),
})

export const MemberEquipmentTab = ({ memberId }) => {
  const {
    userInfo: { memberId: currentMemberId },
  } = useContext(AuthContext)
  const readOnly = memberId !== currentMemberId
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const { isLoading, data } = useFetchMemberEquipmentList(memberId)
  const { data: equipTypeData } = useFetchEquipmentTypeList()
  const { data: storageData } = useFetchStorageList()

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

  const columns = [
    {
      field: 'zach_name',
      headerName: 'Зачет',
      width: 250,
      editable: !readOnly,
      type: 'singleSelect',
      valueOptions: [
        'Оказание доврачебной помощи',
        'Транспортировка подручными средствами',
        'Нормативные документы ФАР',
        'Cпасработы на сложном рельефе в двойке',
        'Cпасработы на сложном рельефе в группе',
      ],
    },
    {
      field: 'zach_grade',
      headerName: 'Оценка',
      width: 150,
      editable: !readOnly,
      type: 'singleSelect',
      valueOptions: ['3', '4', '5'],
    },
    {
      field: 'zach_e1',
      headerName: 'Экзаменатор 1',
      width: 200,
      editable: !readOnly,
    },
    {
      field: 'zach_e2',
      headerName: 'Экзаменатор 2',
      width: 200,
      editable: !readOnly,
    },
    {
      field: 'zach_date',
      ...dateColumnType,
      headerName: 'Дата зачета',
      width: 120,
      editable: !readOnly,
    },
    { field: 'zach_note', headerName: 'Заметки', width: 350, editable: !readOnly },
  ]
  const fieldToFocus = 'fio'
  const columnVisibilityModel = {}

  const processRowUpdate = async (newRow) => {
    validationSchema.validateSync(newRow, { abortEarly: false })
    const handleSave = newRow.isNew ? handleSaveNewItem : handleSaveEditedItem
    await handleSave(newRow)
    queryClient.invalidateQueries({ queryKey: ['member', memberId, 'exam'] })
  }

  if (!memberId) return null
  if (isMobile) return <MobileMemberExamTab isLoading={isLoading} data={data} />

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
