import React, { useContext, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useNavigate, redirect, Link } from 'react-router-dom'
import { AuthContext } from '../components/AuthContext'
import apiClient from '../api/api'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography } from '@mui/material'
import * as Yup from 'yup'
import { format } from 'date-fns'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

const validationSchema = Yup.object({
  email: Yup.string().required('Поле обязательно для заполнения'),
  fio: Yup.string().required('Поле обязательно для заполнения'),
  password: Yup.string().required('Поле обязательно для заполнения'),
  password_repeat: Yup.string()
    .required('Поле обязательно для заполнения')
    .test({
      name: 'notSt',
      exclusive: false,
      params: {},
      message: 'Пароли не совпадают',
      test: (value, context) => value == context.parent.password,
    }),
  date_birth: Yup.string().required('Поле обязательно для заполнения'),
})

const defaultValues = {
  email: '',
  fio: '',
  date_birth: null,
  password: '',
  password_repeat: '',
  gender: 'М',
}

export const PersonalDataConsentPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues, resolver: yupResolver(validationSchema) })

  const [serverError, setServerError] = useState(false)
  const { setIsAuthenticated, setUserInfo } = useContext(AuthContext)
  const handleLogin = (data, e) => {
    e.preventDefault()

    apiClient
      .post('/api/register', { ...data, date_birth: format(data.date_birth, 'yyyy-MM-dd') })
      .then((response) => {
        // Handle successful login
        const { token, user_role, user_id } = response.data
        setIsAuthenticated(true)
        setUserInfo({ id: user_id, role: user_role })
        localStorage.setItem('token', token)
      })
      .catch((error) => {
        // Handle login error
        console.error(error)
        setServerError(true)
      })
  }
  const pStyle = { mb: 2 }
  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Grid
        container
        // justifyContent='center'
        // alignItems='center'
        sx={{ width: '100%' }}
      >
        <Grid
          container
          direction={'column'}
          alignItems={'center'}
          sx={{ width: '100%', ...pStyle }}
        >
          <Typography variant='h3'>Согласие на обработку персональных данных</Typography>
        </Grid>
        <Typography sx={pStyle}>
          Настоящим субъект персональных данных (посетитель сайта https://mtc-tritonn.ru действуя
          свободно, своей волей и в своем интересе, а также подтверждая свою дееспособность, в
          соответствии со ст. 9 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»
          дает согласие оператору - МФСОО «Центр альпинистской подготовки») на обработку своих
          персональных данных на следующих условиях:
        </Typography>
        <Typography sx={pStyle}>
          1. Согласие дается на обработку следующих персональных данных: фамилия, имя, отчество,
          пол, контактные телефоны, дата рождения, адрес электронной почты, город регистрации,
          данные о достижении спортивных результатов на спортивных соревнованиях и тренировках,
          спортивном разряде и званиях.
        </Typography>
        <Typography sx={pStyle}>
          2. Согласие дается на обработку персональных данных с использованием средств автоматизации
          и без использования таких средств.
        </Typography>
        <Typography sx={pStyle}>
          3. Цели обработки персональных данных: развития альпинизма, его продвижения, организации,
          а также проведения спортивных мероприятий и выполнение программ спортивной подготовки в
          соответствии со стандартами спортивной подготовки по виду спорта альпинизм.
        </Typography>
        <Typography sx={pStyle}>
          4. Настоящее согласие на обработку персональных данных включает в себя согласие на
          совершение оператором совокупности действий (операций) с персональными данными: сбор,
          запись, систематизация, накопление, хранение, уточнение (обновление, изменение),
          извлечение, использование, передачу (предоставление, доступ), обезличивание, блокирование,
          удаление, уничтожение.
        </Typography>
        <Typography sx={pStyle}>
          5. Согласие включает в себя согласие на использование на сайте Оператора программных
          средств интернет-статистики (в том числе файлов «cookie» - в случае, если это разрешено в
          настройках браузера Пользователя), позволяющих собирать и обрабатывать обезличенные данные
          о посетителях сайта, просматриваемых страницах, видах и версиях браузера и операционной
          системы, географии посетителей сайта. Указанные данные обрабатываются в целях повышения
          качества сайта.
        </Typography>
        <Typography sx={pStyle}>
          6. Согласие на обработку персональных данных подтверждается мною путем проставления знака
          согласия в форме «Регистрация», размещенной на сайте Оператора, и нажатия кнопки
          «Отправить».
        </Typography>
        <Typography sx={pStyle}>
          7. Настоящее согласие действует до момента отзыва. Настоящее согласие может быть отозвано
          субъектом персональных данных путем направления письменного уведомления об отзыве согласия
          Оператору по адресу электронной почты: info@mtc-tritonn.ru.
        </Typography>
        <Typography sx={pStyle}>
          8. В случае отзыва согласия на обработку персональных данных оператор вправе продолжить
          обработку персональных данных при наличии оснований, указанных в пунктах 2-9.1,11 части 1
          статьи 6, части 2 статьи 10 и части 2 статьи 11 Федерального закона от 27.07.2006 № 152-ФЗ
          «О персональных данных». Подтверждаю, что ознакомлен(а) с положениями Федерального закона
          от 27.07.2006 № 152-ФЗ «О персональных данных», Политикой оператора в отношении
          персональных данных. Права и обязанности в области защиты персональных данных мне понятны.
        </Typography>
      </Grid>
    </Container>
  )
}
