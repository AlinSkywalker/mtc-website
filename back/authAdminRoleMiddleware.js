module.exports = () => {
  return (req, res, next) => {
    // // Проверяем, аутентифицирован ли пользователь
    // if (!req.isAuthenticated()) {
    //   return res.status(401).send('Unauthorized');
    // }

    // Проверяем роль пользователя (или другие данные)
    if (req.user.user_role !== 'ADMIN_ROLE') {
      return res.status(403).send('Forbidden');
    }

    // Если всё ок — передаём управление дальше
    next();
  };
};