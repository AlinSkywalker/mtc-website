// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const eventProtocolRouter = (app, passport) => {
  app.get(
    "/eventList/:eventId/protocol/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const eventId = req.params.eventId;
      pool.query(
        `SELECT mem.fio, IFNULL(m_s_c.ball, 'б/р') AS alprazr,d.depart_inst,
                CASE
                  WHEN d.depart_inst = mem.id AND d.depart_inst<>dp.ascent_head
                      THEN 'Участник'
                  WHEN d.depart_inst = mem.id
                      THEN 'Инструктор'
                  WHEN dp.ascent_head = mem.id 
                      THEN 'Руководитель'
                  ELSE 'Участник'
                  END AS role,
                s.sub_name, m.mount_name, r.rout_name, r.rout_comp,r.rout_tip ,
                'в уч. гр.' AS group_type, dp.start 
                FROM depart_plan dp
                  LEFT JOIN route r on r.id=dp.route
                  LEFT JOIN mount m on m.id=r.rout_mount
                  LEFT JOIN raion rai ON rai.id = m.mount_rai
                  LEFT JOIN region reg ON reg.id = rai.rai_reg
                  LEFT JOIN member mem_head ON mem_head.id = dp.ascent_head
                  LEFT JOIN depart d on d.id=dp.department
                  LEFT JOIN member_in_depart m_d on m_d.membd_dep=dp.department and m_d.membd_date=dp.start
                  LEFT JOIN eventmemb em on em.id=m_d.membd_memb
                  LEFT JOIN member mem ON mem.id = em.eventmemb_memb
                  LEFT JOIN membalp mem_a ON mem_a.id = mem.id
                  LEFT JOIN city c ON c.id = mem.memb_city
                  LEFT JOIN subekt s ON s.id = c.city_sub 
                  LEFT JOIN member_sport_category m_s_c ON m_s_c.id=
                	(SELECT id FROM member_sport_category t1 WHERE type='Разряд' and t1.member=em.eventmemb_memb AND date_completion<dp.start 
                  ORDER BY date_completion DESC LIMIT 1)
                  LEFT JOIN ascent a ON a.asc_memb = mem.id AND a.asc_route=dp.route AND a.asc_date=dp.start AND a.asc_event=d.depart_event
                WHERE d.depart_event=${eventId} AND dp.type='Восхождение' AND dp.accepted='Зачтено' AND a.id IS NOT NULL
                ORDER BY dp.start ASC , d.id ASC, role ASC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = result.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
          res.send(fullResult);
        }
      );
    }
  );
};

// Export the router
module.exports = eventProtocolRouter;
