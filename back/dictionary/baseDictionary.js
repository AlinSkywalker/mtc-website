// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  // baseDictionary
  app.get(
    "/baseDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT
	b.*,
	r.rai_name,
	r.rai_reg,
	reg.region_name,
	b_c.contr_names,
	b_c.contr_ids
FROM
	base b
LEFT JOIN raion r on
	b.base_rai = r.id
LEFT JOIN region reg ON
	r.rai_reg = reg.id
LEFT JOIN (
	SELECT
		b_c.base_base,
		GROUP_CONCAT(c.cont_fio SEPARATOR '||') as contr_names,
		GROUP_CONCAT(c.id SEPARATOR '||') as contr_ids
	FROM
		contr_in_base b_c
	LEFT JOIN contractor c on
		c.id = b_c.base_contr
	GROUP BY
		b_c.base_base) b_c on
	b_c.base_base = b.id;`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const fullResult = result.map((item) => {
            const contr_name_list = item.contr_names?.split("||") || [];
            const contr_id_list = (item.contr_ids || '')
              .split("||")
              .map((item) => Number(item));
            const cont_fio = contr_name_list.join(", ");
            return { ...item, contr_name_list, contr_id_list, cont_fio };
          });
          res.send(fullResult);
        }
      );
    }
  );

  app.get(
    "/external/baseDictionary/:id",
    (req, res) => {
      const { id } = req.params
      pool.query(
        `SELECT b.*
FROM base b
  WHERE b.id=${id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          res.send(result[0]);
        }
      );
    }
  );

  app.put(
    "/baseDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        base_rai,
        base_name,
        base_adres,
        base_desc,
        base_sait,
        contr_id_list,
      } = req.body;
      pool.query(
        `INSERT INTO base (base_rai, base_name, base_adres,base_desc,base_sait) VALUES(?,?,?,?,?)`,
        [base_rai, base_name, base_adres, base_desc, base_sait],
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const baseId = result.insertId;
          const baseContractValues = contr_id_list
            .map((item) => `(${baseId},${item})`)
            .join(", ");
          pool.query(
            `INSERT INTO contr_in_base (base_base, base_contr) VALUES ${baseContractValues}`,
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
  app.post(
    "/baseDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        base_rai,
        base_name,
        base_adres,
        base_desc,
        base_sait,
        contr_id_list,
      } = req.body;
      const baseContractValues = contr_id_list
        .map((item) => `(${id},${item})`)
        .join(", ");
      pool.query(
        `UPDATE base SET 
      base_rai='${base_rai}',
      base_name='${base_name}', 
      base_adres='${base_adres}',
      base_desc='${base_desc}',
      base_sait='${base_sait}',
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `DELETE FROM contr_in_base WHERE base_base=${id}`,
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              pool.query(
                `INSERT INTO contr_in_base (base_base, base_contr) VALUES ${baseContractValues}`,
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
    "/baseDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM base WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );

  //baseHouseDictionary
  app.get(
    "/baseHouseDictionary/:baseId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { baseId } = req.params;
      pool.query(
        `SELECT * FROM base_house WHERE basefd_base=${baseId}`,
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
    "/baseHouseDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { basefd_name, basefd_stol, basefd_kuh, basefd_base } = req.body;
      pool.query(
        `INSERT INTO base_house ( basefd_name, basefd_stol, basefd_kuh,basefd_base) VALUES(?,?,?,?)`,
        [basefd_name, basefd_stol, basefd_kuh, basefd_base],
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
    "/baseHouseDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { basefd_name, basefd_stol, basefd_kuh } = req.body;
      pool.query(
        `UPDATE base_house SET 
      basefd_name='${basefd_name}',
      basefd_stol=${basefd_stol},
      basefd_kuh=${basefd_kuh},
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
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
    "/baseHouseDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM base_house WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );

  //baseHouseRoomDictionary
  app.get(
    "/baseHouseRoomDictionary/:baseHouseId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { baseHouseId } = req.params;
      pool.query(
        `SELECT * FROM base_house_room WHERE basenom_fd=${baseHouseId}`,
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
    "/baseHouseRoomDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        basenom_mest,
        basenom_ud,
        basenom_bal,
        basenom_sem,
        basenom_pod,
        basenom_prais,
        basenom_akt,
        basenom_fd,
        basenom_name,
        basenom_koi
      } = req.body;
      pool.query(
        `INSERT INTO base_house_room ( basenom_mest, basenom_ud, basenom_bal, basenom_sem, basenom_pod, basenom_prais, basenom_akt,basenom_fd,basenom_name,basenom_koi) 
                VALUES(?,?,?,?,?,?,?,?,?,?)`,
        [
          basenom_mest,
          basenom_ud,
          basenom_bal,
          basenom_sem,
          basenom_pod,
          basenom_prais,
          basenom_akt,
          basenom_fd,
          basenom_name,
          basenom_koi
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
    "/baseHouseRoomDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        basenom_mest,
        basenom_ud,
        basenom_bal,
        basenom_sem,
        basenom_pod,
        basenom_prais,
        basenom_akt,
        basenom_name,
        basenom_koi,
      } = req.body;
      pool.query(
        `UPDATE base_house_room SET 
      basenom_mest=?,
      basenom_ud='${basenom_ud}',
      basenom_bal=${basenom_bal},
      basenom_sem=${basenom_sem},
      basenom_pod=${basenom_pod},
      basenom_prais=?,
      basenom_akt='${basenom_akt}',
      basenom_name='${basenom_name}',
      basenom_koi=${basenom_koi},
      updated_date=CURRENT_TIMESTAMP WHERE id=${id}`,
        [basenom_mest, basenom_prais],
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
    "/baseHouseRoomDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(
        `DELETE FROM base_house_room WHERE id=${id}`,
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
};

// Export the router
module.exports = dictionaryRouter;
