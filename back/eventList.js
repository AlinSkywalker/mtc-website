// Load the MySQL pool connection
const pool = require("./mysql");

// Route the app
const eventListRouter = (app, passport) => {
  app.get(
    "/eventList/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, rai.rai_name, e_r.raion_names, e_r.raion_ids
            FROM eventalp e
            LEFT JOIN raion rai on e.event_raion=rai.id
            LEFT JOIN member m_ob on e.event_ob = m_ob.id
            LEFT JOIN member m_st on e.event_st = m_st.id
            LEFT JOIN (
                SELECT
                  e_r.event_m,
                  GROUP_CONCAT(r.rai_name SEPARATOR '||') as raion_names,
                  GROUP_CONCAT(r.id SEPARATOR '||') as raion_ids
                FROM
                  eventalp_in_raion e_r
                LEFT JOIN raion r on
                  r.id = e_r.raion_m
                GROUP BY
                  e_r.event_m) e_r on
                e_r.event_m = e.id
            ORDER BY e.event_start DESC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = result.map((item) => {
            const raion_name_list = item.raion_names?.split("||");
            const raion_id_list = item.raion_ids
              ?.split("||")
              .map((item) => Number(item));
            const raion_name = raion_name_list?.join(", ");
            return { ...item, raion_name_list, raion_id_list, raion_name };
          });
          res.send(fullResult);
        }
      );
    }
  );
  app.put(
    "/eventList/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        event_name,
        event_raion,
        event_start,
        event_finish,
        event_st,
        event_ob,
        event_desc,
        raion_id_list,
      } = req.body;
      pool.query(
        `INSERT INTO eventalp (event_name, event_raion, event_start,event_finish, event_st, event_ob,event_desc) 
                  VALUES('${event_name}',
                  ${event_raion},
                  CONVERT('${event_start}',DATETIME),
                  CONVERT('${event_finish}',DATETIME),
                  ${event_st},
                  ${event_ob},
                  '${event_desc}')`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const eventId = result.insertId;
          const eventRaionValues = raion_id_list
            .map((item) => `(${eventId},${item})`)
            .join(", ");
          pool.query(
            `INSERT INTO eventalp_in_raion (event_m, raion_m) VALUES ${eventRaionValues}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              res.json({ success: true });
            }
          );
        }
      );
    }
  );

  app.get(
    "/eventList/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `SELECT e.*, m_ob.fio as ob_fio, m_st.fio as st_fio, rai.rai_name , e_r.raion_names, e_r.raion_ids
        FROM eventalp e 
      LEFT JOIN raion rai on e.event_raion=rai.id
      LEFT JOIN member m_ob on e.event_ob = m_ob.id
      LEFT JOIN member m_st on e.event_st = m_st.id 
      LEFT JOIN (
        SELECT
          e_r.event_m,
          GROUP_CONCAT(r.rai_name SEPARATOR '||') as raion_names,
          GROUP_CONCAT(r.id SEPARATOR '||') as raion_ids
        FROM
          eventalp_in_raion e_r
        LEFT JOIN raion r on
          r.id = e_r.raion_m
        GROUP BY
          e_r.event_m) e_r on e_r.event_m = e.id
      WHERE e.id='${id}'`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          if (result.length == 0) {
            res.send("Ничего не найдено");
            return;
          }
          const { ob_fio, event_ob, st_fio, event_st, rai_name, event_raion } =
            result[0];
          // console.log(result[0])
          const raion_name_list = result[0].raion_names?.split("||");
          const raion_id_list = result[0].raion_ids
            ?.split("||")
            .map((item) => Number(item));
          const raion_name = raion_name_list?.join(", ");
          const fullResult = {
            ...result[0],
            ob: { fio: ob_fio, id: event_ob },
            st: { fio: st_fio, id: event_st },
            raion: { rai_name, id: event_raion },
            raion_name_list,
            raion_id_list,
            raion_name,
          };
          res.send(fullResult);
        }
      );
    }
  );
  app.post(
    "/eventList/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        event_name,
        event_raion,
        event_start,
        event_finish,
        event_st,
        event_ob,
        event_desc,
        price,
        raion_id_list,
      } = req.body;
      const eventRaionValues = raion_id_list
        .map((item) => `(${id},${item})`)
        .join(", ");
      pool.query(
        `UPDATE eventalp SET 
        event_name=?,
        event_start=?,
        event_finish=?,
        event_raion=${event_raion},
        event_st=${event_st},
        event_ob=${event_ob},
        event_desc=?,
        price=?,
        updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [event_name, event_start, event_finish, event_desc, price || null],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `DELETE FROM eventalp_in_raion WHERE event_m=${id}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              pool.query(
                `INSERT INTO eventalp_in_raion (event_m, raion_m) VALUES ${eventRaionValues}`,
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                  }
                  res.json({ success: true });
                }
              );
            }
          );
        }
      );
    }
  );
  app.delete(
    "/eventList/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM eventalp WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
  app.get(
    "/eventList/:id/statistics",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const queries = [];
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
module.exports = eventListRouter;
