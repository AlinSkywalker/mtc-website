// Load the MySQL pool connection
const pool = require("./mysql");
const checkAdminAccess = require('./authAdminRoleMiddleware');
const sendTelegramMessage = require("./telegram");

// Route the app
const membershipApplicationRouter = (app, passport) => {
  app.get(
    "/membershipApplication/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      pool.query(
        `SELECT m_a.*, m.fio 
          FROM membership_application m_a
          LEFT OUTER JOIN member m on m.id=m_a.member_id
          ORDER BY created_date DESC`,
        (error, result_ma) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }

          pool.query(
            `SELECT m.id, m.fio
                FROM board_members bm
                LEFT JOIN member m ON m.id=bm.member_id`,
            (error, result_bm) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }

              const fullResult = result_ma.map(item => {
                if (!item.voting_results) return item
                const votingResultsWithFio = Object.entries(item.voting_results).reduce((acc, [votingMember, votingResult]) => {
                  const fio = result_bm.find(member => member.id === Number(votingMember))?.fio || votingMember
                  acc.push(`${fio}: ${votingResult === 'yes' ? 'Да' : 'Нет'}`)
                  return acc
                }, []).join(', ')
                return { ...item, votingResultsWithFio }
              })

              res.send(fullResult);
            }
          );
        }
      );
    }
  );

  app.put('/membershipApplication/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const member_id = req.user.user_member_id;
      pool.query(
        `SELECT m_a.*
          FROM membership_application m_a
          WHERE m_a.member_id=${member_id}
          ORDER BY created_date DESC`,
        (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          if (result.length !== 0) {
            res.status(500).json({ success: false, message: 'Вы уже подали заявку на вступление' });
          }
          else {
            pool.query(`INSERT INTO membership_application ( member_id) 
      VALUES(${member_id})`, (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return
              }
              res.send(result);
              pool.query(`SELECT * FROM member WHERE id='${member_id}'`, (error, member_result) => {
                if (error) {
                  console.log(error);
                  return
                }
                const memberData = member_result[0]
                const messageText = `Получена новая заявка на вступление в клуб от <b>${memberData.fio}</b>`
                sendTelegramMessage(messageText, '-1003797944228')
              });
            });
          }
        }
      );

    })
  app.post('/membershipApplication/:id/confirmPayment',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { id } = req.params;
      pool.query(
        `SELECT m_a.*
          FROM membership_application m_a
          WHERE id=${id}`,
        (error, result_ma) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }

          pool.query(
            `SELECT COUNT(bm.id) as board_members_count
                FROM board_members bm`,
            (error, result_bm) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              const boardMembersCount = result_bm[0]?.board_members_count
              const voting_results = result_ma[0]?.voting_results

              let statusUpdateStatement = ''
              let needToSetMembership = false
              const positiveVotedMemberCount = Object.values(voting_results || {}).filter(item => item === 'yes').length
              if (voting_results && positiveVotedMemberCount > (boardMembersCount / 2)) {
                needToSetMembership = true
                statusUpdateStatement = `status='Принято',`
              }
              pool.query(
                `UPDATE membership_application SET 
                  payment_confirmed=1,
                  ${statusUpdateStatement}
                  updated_date=CURRENT_TIMESTAMP
                  WHERE id=${id}`,
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                  }
                  if (needToSetMembership) {
                    pool.query(
                      `UPDATE member SET 
                        memb=1,
                        updated_date=CURRENT_TIMESTAMP
                        WHERE id=${result_ma[0]?.member_id}`,
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
                  res.send(result);
                }
              );
            }
          );
        }
      );


    })
  app.post(
    '/membershipApplication/:id/vote/:vote',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { id, vote } = req.params;
      const currentUserMemberId = req.user.user_member_id
      pool.query(
        `SELECT m_a.*
          FROM membership_application m_a
          WHERE id=${id}`,
        (error, result_ma) => {
          if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error });
            return;
          }
          pool.query(
            `SELECT COUNT(bm.id) as board_members_count
                FROM board_members bm`,
            (error, result_bm) => {
              if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error });
                return;
              }
              const { voting_results, status, member_id, payment_confirmed } = result_ma[0] || {}
              const boardMembersCount = result_bm[0]?.board_members_count

              const newVotingResults = { ...(voting_results || {}), [currentUserMemberId]: vote }

              let statusUpdateStatement = ''
              let needToSetMembership = false
              const positiveVotedMemberCount = Object.values(newVotingResults).filter(item => item === 'yes').length
              if (positiveVotedMemberCount > (boardMembersCount / 2) && vote === 'yes' && status === 'Новая' && payment_confirmed) {
                statusUpdateStatement = `status='Принято',`
                needToSetMembership = true
              }

              pool.query(
                `UPDATE membership_application SET 
                  voting_results='${JSON.stringify(newVotingResults)}',
                  ${statusUpdateStatement}
                  updated_date=CURRENT_TIMESTAMP
                  WHERE id=${id}`,
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                  }
                  if (needToSetMembership) {
                    pool.query(
                      `UPDATE member SET 
                        memb=1,
                        updated_date=CURRENT_TIMESTAMP
                        WHERE id=${member_id}`,
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
                  res.send(result);
                }
              );
            }
          );
        }
      );
    })
  app.delete(
    "/membershipApplication/:id",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      const id = req.params.id;
      pool.query(`DELETE FROM membership_application WHERE id=${id}`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return;
        }
        res.json({ success: true });
      });
    }
  );
};

// Export the router
module.exports = membershipApplicationRouter;
