import * as Yup from 'yup'

export const eventDepartmentPlanValidationSchema = Yup.object({
  type: Yup.string().required('Поле обязательно для заполнения'),
  start: Yup.string().required('Поле обязательно для заполнения'),
  laba_name: Yup.string()
    .nullable(true)
    .test({
      name: '2',
      exclusive: false,
      params: {},
      message: 'Для занятия обязательна лаборатория',
      test: (value, context) => value == null || !(context.parent.type == 'Занятие' && !value),
    }),
  rout_name: Yup.string()
    .nullable(true)
    .test({
      name: '2',
      exclusive: false,
      params: {},
      message: 'Для восхождения обязателен маршрут',
      test: (value, context) => value == null || !(context.parent.type == 'Восхождение' && !value),
    }),
})
