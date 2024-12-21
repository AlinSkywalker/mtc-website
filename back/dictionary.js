// Load the MySQL pool connection
const pool = require("./mysql");

// Route the app
const dictionaryRouter = (app, passport) => {
  //regionDictionary
  app.get(
    "/regionDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(`SELECT * FROM region`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
  app.put(
    "/regionDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { name, desc } = req.body;
      pool.query(
        `INSERT INTO region (region_name, region_desk) VALUES(?,?)`,
        [name, desc],
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
  app.post(
    "/regionDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { name, desc } = req.body;
      pool.query(
        `UPDATE region SET 
      region_name='${name}',
      region_desk='${desc}',
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
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

  app.delete(
    "/regionDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM region WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );

  // districtDictionary
  app.get(
    "/districtDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT r.*, reg.id AS region_id, reg.region_name FROM raion r 
                LEFT JOIN region reg on reg.id=r.rai_reg`,
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
    "/districtDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { rai_name, rai_desc, rai_num, rai_reg } = req.body;
      pool.query(
        `INSERT INTO raion (rai_name, rai_desc, rai_num, rai_reg) VALUES(?,?,?,?)`,
        [rai_name, rai_desc, rai_num, rai_reg],
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
  app.post(
    "/districtDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { rai_name, rai_desc, rai_num, rai_reg } = req.body;
      pool.query(
        `UPDATE raion SET 
      rai_name='${rai_name}',
      rai_desc='${rai_desc}', 
      rai_num='${rai_num}', 
      rai_reg='${rai_reg}',
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
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
  app.delete(
    "/districtDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM raion WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );

  // summitDictionary
  app.get(
    "/summitDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT m.*, r.rai_name, r.rai_reg, reg.region_name FROM mount m 
                LEFT JOIN raion r ON m.mount_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id
                ORDER BY r.rai_num, m.mount_name`,
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
    "/summitDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { mount_rai, mount_desc, mount_height, mount_name } = req.body;
      pool.query(
        `INSERT INTO mount (mount_rai, mount_desc, mount_height, mount_name) VALUES(?,?,?,?)`,
        [mount_rai, mount_desc, mount_height || null, mount_name],
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
  app.post(
    "/summitDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { mount_rai, mount_desc, mount_height, mount_name } = req.body;
      pool.query(
        `UPDATE mount SET 
      mount_rai='${mount_rai}',
      mount_desc='${mount_desc}', 
      mount_height='${mount_height || null}', 
      mount_name='${mount_name}',
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
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
  app.delete(
    "/summitDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM mount WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );

  // routeDictionary
  app.get(
    "/routeDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT r.*, m.mount_name, m.mount_rai, rai.rai_name, rai.rai_reg, reg.region_name  FROM route r 
                LEFT JOIN mount m ON r.rout_mount=m.id
                LEFT JOIN raion rai ON m.mount_rai=rai.id
                LEFT JOIN region reg ON rai.rai_reg = reg.id
                ORDER BY rai.rai_num, m.mount_name, r.rout_name`,
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
    "/routeDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        rout_mount,
        rout_desc,
        rout_per,
        rout_sup,
        rout_tip,
        rout_comp,
        rout_name,
        rout_winter,
      } = req.body;
      pool.query(
        `INSERT INTO route (rout_mount, rout_desc, rout_per, rout_sup, rout_tip, rout_comp, rout_name,rout_winter) VALUES(?,?,?,?,?,?,?,?)`,
        [
          rout_mount,
          rout_desc,
          rout_per || null,
          rout_sup,
          rout_tip,
          rout_comp,
          rout_name,
          rout_winter,
        ],
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
  app.post(
    "/routeDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        rout_mount,
        rout_desc,
        rout_per,
        rout_sup,
        rout_tip,
        rout_comp,
        rout_name,
        rout_winter,
      } = req.body;
      pool.query(
        `UPDATE route SET 
      rout_mount=${rout_mount},
      rout_desc='${rout_desc}', 
      rout_per=?, 
      rout_sup='${rout_sup}',
      rout_tip='${rout_tip}', 
      rout_comp='${rout_comp}', 
      rout_name='${rout_name}',
      rout_winter=${rout_winter},
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
        [rout_per || null],
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
  app.delete(
    "/routeDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM route WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
        return;
      });
    }
  );

  // laboratoryDictionary
  app.get(
    "/laboratoryDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT l.*, r.rai_name, r.rai_reg, reg.region_name FROM laba l 
                LEFT JOIN raion r ON l.laba_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id`,
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
    "/laboratoryDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { laba_name, laba_desk, laba_rai } = req.body;
      pool.query(
        `INSERT INTO laba (laba_name, laba_desk, laba_rai) VALUES(?,?,?)`,
        [laba_name, laba_desk, laba_rai],
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
  app.post(
    "/laboratoryDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { laba_name, laba_desk, laba_rai } = req.body;
      pool.query(
        `UPDATE laba SET 
      laba_name='${laba_name}',
      laba_desk='${laba_desk}', 
      laba_rai='${laba_rai}',
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
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
  app.delete(
    "/laboratoryDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM laba WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );
  app.get(
    "/laboratoryDictionaryForEvent/:eventId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { eventId } = req.params
      pool.query(
        `SELECT l.*, r.rai_name, r.rai_reg, reg.region_name FROM laba l 
                LEFT JOIN raion r ON l.laba_rai=r.id
                LEFT JOIN region reg ON r.rai_reg = reg.id
                WHERE laba_rai=(SELECT event_raion FROM eventalp WHERE id=${eventId})`,
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

  // laboratoryRouteDictionary
  app.get(
    "/laboratoryRouteDictionary/:laboratoryId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.laboratoryId;
      if (id === "undefined") {
        res.send([]);
        return;
      }
      pool.query(
        `SELECT * FROM laba_tr WHERE labatr_lab=${id}`,
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
    "/laboratoryRouteDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        labatr_name,
        labatr_typ,
        labatr_sl,
        labatr_dl,
        labatr_kolb,
        labatr_lab,
        labatr_desk,
      } = req.body;
      pool.query(
        `INSERT INTO laba_tr (labatr_name, labatr_typ, labatr_sl,labatr_dl,labatr_kolb,labatr_lab,labatr_desk) VALUES(?,?,?,?,?,?,?)`,
        [
          labatr_name,
          labatr_typ,
          labatr_sl,
          labatr_dl || 0,
          labatr_kolb || 0,
          labatr_lab,
          labatr_desk,
        ],
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
  app.post(
    "/laboratoryRouteDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        labatr_name,
        labatr_typ,
        labatr_sl,
        labatr_dl,
        labatr_kolb,
        labatr_desk,
      } = req.body;
      pool.query(
        `UPDATE laba_tr SET 
      labatr_name='${labatr_name}',
      labatr_typ='${labatr_typ}', 
      labatr_sl='${labatr_sl}',
      labatr_dl=?,
      labatr_kolb=?,
      labatr_desk=?,
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
        [labatr_dl || 0, labatr_kolb || 0, labatr_desk],
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

  app.delete(
    "/laboratoryRouteDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM laba_tr WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );

  // contractorDictionary
  app.get(
    "/contractorDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const baseId = req.query.baseId;
      if (baseId) {
        pool.query(
          `SELECT c.* FROM contr_in_base b_c LEFT JOIN contractor c on c.id = b_c.base_contr WHERE b_c.base_base='${baseId}'`,
          (error, result) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: error });
              return;
            }
            res.send(result);
          }
        );
      } else {
        pool.query(`SELECT * FROM contractor`, (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          const returnType = req.query.returnType;
          if (returnType == "objectType") {
            const newResult = {};
            result.forEach((item) => {
              newResult[item.id] = { ...item, name: item.cont_fio };
            });
            res.send(newResult);
          } else {
            res.send(result);
          }
        });
      }
    }
  );

  app.put(
    "/contractorDictionary",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const {
        cont_fio,
        cont_desc,
        cont_email,
        cont_tel3,
        cont_tel2,
        cont_tel1,
        cont_zan,
      } = req.body;
      pool.query(
        `INSERT INTO contractor (cont_fio, cont_desc, cont_email,cont_tel3, cont_tel2, cont_tel1,cont_zan) VALUES(?,?,?,?,?,?,?)`,
        [
          cont_fio,
          cont_desc,
          cont_email,
          cont_tel3,
          cont_tel2,
          cont_tel1,
          cont_zan,
        ],
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
  app.post(
    "/contractorDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const {
        cont_fio,
        cont_desc,
        cont_email,
        cont_tel3,
        cont_tel2,
        cont_tel1,
        cont_zan,
      } = req.body;
      pool.query(
        `UPDATE contractor SET 
      cont_fio='${cont_fio}',
      cont_desc='${cont_desc}', 
      cont_email='${cont_email}',
      cont_tel3='${cont_tel3}',
      cont_tel2='${cont_tel2}',
      cont_tel1='${cont_tel1}',
      cont_zan='${cont_zan}',
      updated_date=CURRENT_TIMESTAMP
      WHERE id=${id}`,
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

  app.delete(
    "/contractorDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM contractor WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );

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
            const contr_name_list = item.contr_names.split("||");
            const contr_id_list = item.contr_ids
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
      } = req.body;
      pool.query(
        `INSERT INTO base_house_room ( basenom_mest, basenom_ud, basenom_bal, basenom_sem, basenom_pod, basenom_prais, basenom_akt,basenom_fd,basenom_name) 
                VALUES(?,?,?,?,?,?,?,?,?)`,
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

  // cityDictionary
  app.get(
    "/cityDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(`SELECT * FROM city`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
  app.put(
    "/cityDictionary/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { name_city, desc_city, pred_city, tel_city, email } = req.body;
      pool.query(
        `INSERT INTO city ( name_city, desc_city, pred_city, tel_city, email) VALUES(?,?,?,?,?)`,
        [name_city, desc_city, pred_city, tel_city, email],
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
    "/cityDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      const { name_city, desc_city, pred_city, tel_city, email } = req.body;
      pool.query(
        `UPDATE city SET 
      name_city='${name_city}',
      desc_city='${desc_city}',
      pred_city='${pred_city}',
      tel_city='${tel_city}',
      email='${email}',
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
    "/cityDictionary/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM city WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.send(result);
      });
    }
  );
};

// Export the router
module.exports = dictionaryRouter;
