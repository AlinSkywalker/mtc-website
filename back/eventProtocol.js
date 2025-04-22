// Load the MySQL pool connection
const pool = require("./mysql")

// Route the app
const eventProtocolRouter = (app, passport) => {
  app.get('/eventList/:eventId/protocol/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const eventId = req.params.eventId;
    pool.query(`SELECT mem.fio, IFNULL(mem_a.alprazr, 'б/р') AS alprazr,d.depart_inst,
                CASE
				    WHEN d.depart_inst = mem.id
				        THEN 'Инструктор'
				    WHEN dp.ascent_head = mem.id 
				        THEN 'Руководитель'
				    ELSE 'Участник'
				END AS role,
                s.sub_name, m.mount_name, r.rout_name, r.rout_comp,r.rout_tip ,
                CASE
				    WHEN dp.ascent_head IS NOT NULL AND  dp.ascent_head <> ''
				        THEN 'в сп. гр.'
				    ELSE 'в уч. гр.'
				END AS group_type, dp.start 
                FROM mtc_db.depart_plan dp
                  LEFT JOIN mtc_db.route r on r.id=dp.route
                  LEFT JOIN mtc_db.mount m on m.id=r.rout_mount
                  LEFT JOIN mtc_db.raion rai ON rai.id = m.mount_rai
                  LEFT JOIN mtc_db.region reg ON reg.id = rai.rai_reg
                  LEFT JOIN mtc_db.member mem_head ON mem_head.id = dp.ascent_head
                  LEFT JOIN mtc_db.depart d on d.id=dp.department
                  LEFT JOIN mtc_db.member_in_depart m_d on m_d.membd_dep=dp.department and m_d.membd_date=dp.start
                  LEFT JOIN mtc_db.eventmemb em on em.id=m_d.membd_memb
                  LEFT JOIN mtc_db.member mem ON mem.id = em.eventmemb_memb
                  LEFT JOIN mtc_db.membalp mem_a ON mem_a.id = mem.id
                  LEFT JOIN mtc_db.city c ON c.id = mem.memb_city
                  LEFT JOIN mtc_db.subekt s ON s.id = c.city_sub 
                WHERE d.depart_event=${eventId} AND dp.type='Восхождение' AND dp.accepted='Зачтено' 
                ORDER BY dp.start ASC , d.id ASC, role ASC`, (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
        return
      }
      const fullResult = result.map((item, index) => ({ ...item, id: index + 1 }))
      res.send(fullResult);
    });
  })



}

// Export the router
module.exports = eventProtocolRouter;