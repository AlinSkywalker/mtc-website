// Load the MySQL pool connection
const pool = require("../mysql");
const fs = require('fs');

function getRandomNumber(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

const saveFiles = ({ eventId, fio, med_file, strah_file }) => {
  const fileBasePath = `uploads_mtc/event/${eventId}/members`

  let newFilePathMed = ''
  let fileNameMed = ''

  if (med_file) {
    fileNameMed = `${fio} справка ${med_file.name}`
    newFilePathMed = `${fileBasePath}/${fileNameMed}`
    if (fs.existsSync(newFilePathMed)) {
      const randomNumber = getRandomNumber(0, 1000)
      newFilePathMed = `${fileBasePath}/${randomNumber}-${fileNameMed}`
    }
    med_file.mv(newFilePathMed);
  }
  let newFilePathStrah = ''
  let fileNameStrah = ''
  if (strah_file) {
    fileNameStrah = `${fio} страховка ${strah_file.name}`
    newFilePathStrah = `${fileBasePath}/${fileNameStrah}`
    if (fs.existsSync(newFilePathStrah)) {
      const randomNumber = getRandomNumber(0, 1000)
      newFilePathStrah = `${fileBasePath}/${randomNumber}-${fileNameStrah}`
    }
    strah_file.mv(newFilePathStrah);
  }

  return { fileNameStrah, newFilePathStrah, newFilePathMed, fileNameMed }
}
// Route the app
const eventMemberRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/member/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      pool.query(
        `SELECT e_m.*, m.fio, m.gender, m.tel_1, m.memb_email, m.size_cloth, m.size_shoe, c.name_city, 
                    COUNT(m_i_d.id) as days_with_dept, e.price, m_s_c.ball 
                FROM eventmemb e_m
                LEFT JOIN member m on m.id=e_m.eventmemb_memb 
                LEFT JOIN city c on m.memb_city=c.id
                LEFT JOIN member_in_depart m_i_d on m_i_d.membd_memb =e_m.id
                LEFT JOIN eventalp e on e.id=e_m.eventmemb_even
                LEFT JOIN member_sport_category m_s_c ON m_s_c.id=
                (SELECT id FROM member_sport_category t1 WHERE type='Разряд' and t1.member=e_m.eventmemb_memb ORDER BY date_completion DESC LIMIT 1)
                WHERE eventmemb_even='${eventId}'
                GROUP BY e_m.id, m_s_c.ball 
                ORDER BY m.fio ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = result.map((item) => {
            const memberDays =
              (new Date(item.eventmemb_datef) -
                new Date(item.eventmemb_dates)) /
              (1000 * 60 * 60 * 24) +
              1;
            const daysWithDept = item.days_with_dept;
            const allDaysWithDept = daysWithDept >= memberDays;
            const alerts = [];
            if (!allDaysWithDept) {
              alerts.push("У участника не указано отделение на некоторые дни");
            }
            if (
              item.eventmemb_pred < item.price &&
              item.eventmemb_role === "Участник"
            ) {
              alerts.push("У участника не полная оплата");
            }
            return { ...item, allDaysWithDept, alerts };
          });
          res.send(fullResult);
        }
      );
    }
  );

  app.get(
    "/eventList/:eventId/instructors/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      pool.query(
        `SELECT e_m.*, m.fio, m.id as member_id
                FROM eventmemb e_m
                LEFT JOIN member m on m.id=e_m.eventmemb_memb 
                WHERE eventmemb_even=${eventId} AND e_m.eventmemb_role='Инструктор'
                ORDER BY m.fio ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );

  app.put(
    "/eventList/:eventId/member/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      const data = JSON.parse(req.body.data)
      const {
        eventmemb_nstrah,
        eventmemb_nmed,
        eventmemb_memb,
        eventmemb_dates,
        eventmemb_datef,
        eventmemb_gen,
        eventmemb_pred,
        eventmemb_opl,
        eventmemb_role,
        fio,
      } = data;


      const med_file = req.files?.med_file;
      const strah_file = req.files?.strah_file;
      const { fileNameStrah, newFilePathStrah, newFilePathMed, fileNameMed } = saveFiles({ eventId, fio, med_file, strah_file })


      pool.query(
        `INSERT INTO eventmemb 
        ( eventmemb_nstrah, eventmemb_nmed, eventmemb_memb, eventmemb_dates, 
         eventmemb_datef,eventmemb_even,eventmemb_gen,eventmemb_pred,
         eventmemb_opl,eventmemb_role, strah_file_path, strah_file_name, med_file_path, med_file_name) 
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          eventmemb_nstrah,
          eventmemb_nmed,
          eventmemb_memb,
          eventmemb_dates,
          eventmemb_datef,
          eventId,
          eventmemb_gen,
          eventmemb_pred,
          eventmemb_opl || 0,
          eventmemb_role,
          newFilePathStrah,
          fileNameStrah,
          newFilePathMed,
          fileNameMed
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );

  app.post(
    "/eventList/:eventId/member/:memberId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { memberId, eventId } = req.params;
      const data = JSON.parse(req.body.data)
      const {
        eventmemb_nstrah,
        eventmemb_nmed,
        eventmemb_dates,
        eventmemb_datef,
        eventmemb_gen,
        eventmemb_pred,
        eventmemb_opl,
        eventmemb_role,
        fio,
        strah_file_name,
        med_file_name,
        strah_file_path,
        med_file_path
      } = data;


      const med_file = req.files?.med_file;
      const strah_file = req.files?.strah_file;
      const { fileNameStrah, newFilePathStrah, newFilePathMed, fileNameMed } = saveFiles({ eventId, fio, med_file, strah_file })

      if (!strah_file_name) {
        try {
          fs.unlinkSync(strah_file_path)
        } catch (e) { }

      }
      const strahFileUpdateStatement = strah_file_name
        ? strah_file
          ? `strah_file_path='${newFilePathStrah}', strah_file_name='${fileNameStrah}',`
          : ''
        : `strah_file_path='', strah_file_name='',`

      if (!med_file_name) {
        try {
          fs.unlinkSync(med_file_path)
        } catch (e) { }
      }
      // const medFileUpdateStatement = med_file
      //   ? med_file_name
      //     ? `med_file_path='${newFilePathMed}', med_file_name='${fileNameMed}',`
      //     : `med_file_path='', med_file_name='',`
      //   : ''

      const medFileUpdateStatement = med_file_name
        ? med_file
          ? `med_file_path='${newFilePathMed}', med_file_name='${fileNameMed}',`
          : ''
        : `med_file_path='', med_file_name='',`


      pool.query(
        `UPDATE eventmemb SET 
      eventmemb_nstrah=${eventmemb_nstrah},
      eventmemb_nmed=${eventmemb_nmed},
      eventmemb_dates='${eventmemb_dates}',
      eventmemb_datef='${eventmemb_datef}',
      eventmemb_gen=${eventmemb_gen},
      eventmemb_pred=${eventmemb_pred},
      eventmemb_opl=${eventmemb_opl},
      eventmemb_role='${eventmemb_role}',
      ${medFileUpdateStatement}
      ${strahFileUpdateStatement}    
      updated_date=CURRENT_TIMESTAMP WHERE id=${memberId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );
  app.delete(
    "/eventList/:eventId/member/:memberId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const memberId = req.params.memberId;
      pool.query(
        `DELETE FROM eventmemb WHERE id=${memberId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result);
        }
      );
    }
  );

  app.get(
    "/eventList/:eventId/members/files/:memberId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { memberId } = req.params;
      const { filePathField, fileNameField } = req.query;
      pool.query(
        `SELECT * FROM eventmemb WHERE id=${memberId}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const filePath = result[0][filePathField]//.replaceAll('/', '\\')
          const fileName = result[0][fileNameField]
          const file = `${__dirname}/../${filePath}`;
          var newFileName = encodeURIComponent(fileName);
          res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + newFileName);
          res.download(file); // Set disposition and send it.
        }
      );
    }
  );
};

// Export the router
module.exports = eventMemberRouter;
