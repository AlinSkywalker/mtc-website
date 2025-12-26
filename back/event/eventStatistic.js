// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const eventStatisticRouter = (app, passport) => {
  app.get(
    "/eventList/:id/statistics",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const queries = [];
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) as result_count FROM eventmemb em
                        WHERE em.eventmemb_even=${id}`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "total_members",
                  statistics: "Количество участников",
                  result: result[0].result_count,
                });
              }
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT size_cloth, count(em.id) as result_count FROM eventmemb em
                        LEFT JOIN member m on m.id=em.eventmemb_memb
                        WHERE em.eventmemb_even=${id}
                        GROUP BY size_cloth`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "size_cloth",
                  statistics: "Размеры одежды",
                  result: result
                    .map((item) => `${item.size_cloth}(${item.result_count})`)
                    .join(", "),
                });
              }
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(em.id) as result_count FROM eventmemb em
                        LEFT JOIN member m on m.id=em.eventmemb_memb
                        WHERE em.eventmemb_even=${id}
                        GROUP BY memb_city`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "city",
                  statistics: "Города участников",
                  result: result.length,
                });
              }
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(em.id) as result_count FROM eventmemb em
                        LEFT JOIN member m on m.id=em.eventmemb_memb
                        LEFT JOIN city c on c.id=m.memb_city
                        WHERE em.eventmemb_even=${id}
                        GROUP BY city_sub`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "region",
                  statistics: "Регионы участников",
                  result: result.length,
                });
              }
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(em.id) as result_count FROM eventmemb em
                        LEFT JOIN member m on m.id=em.eventmemb_memb
                        LEFT JOIN city c on c.id=m.memb_city
                        LEFT JOIN subekt s on s.id=c.city_sub
                        WHERE em.eventmemb_even=${id}
                        GROUP BY sub_okr`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "okrug",
                  statistics: "Округа участников",
                  result: result.length,
                });
              }
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(em.id) as result_count FROM eventmemb em
                        LEFT JOIN member m on m.id=em.eventmemb_memb
                        LEFT JOIN city c on c.id=m.memb_city
                        LEFT JOIN subekt s on s.id=c.city_sub
                        LEFT JOIN okrug o on o.id=s.sub_okr
                        WHERE em.eventmemb_even=${id}
                        GROUP BY okr_count`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "country",
                  statistics: "Страны участников",
                  result: result.length,
                });
              }
            }
          );
        })
      );
      queries.push(
        new Promise((resolve, reject) => {
          pool.query(
            `SELECT r.rout_comp, count(dp.id) as result_count FROM depart_plan dp
                        LEFT JOIN depart d on d.id=dp.department
                        LEFT JOIN route r on r.id=dp.route
                        WHERE d.depart_event=${id} AND dp.type='Восхождение' AND dp.accepted='Зачтено' 
                        GROUP BY r.rout_comp
                        ORDER BY r.rout_comp ASC`,
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  id: "rout_count",
                  statistics: "Схожено маршрутов",
                  result: result
                    .map((item) => `${item.rout_comp}(${item.result_count})`)
                    .join(", "),
                });
              }
            }
          );
        })
      );
      Promise.all(queries)
        .then((resultsArray) => {
          res.send(resultsArray);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ success: false, message: error });
          return;
        });
    }
  );
};
// Export the router
module.exports = eventStatisticRouter;
