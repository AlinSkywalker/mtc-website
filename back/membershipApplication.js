// Load the MySQL pool connection
const pool = require("./mysql");
const checkAdminAccess = require('./authAdminRoleMiddleware');

// Route the app
const membershipApplicationRouter = (app, passport) => {
  app.get(
    "/membershipApplication/",
    passport.authenticate("jwt", { session: false }),
    checkAdminAccess(),
    (req, res) => {
      pool.query(
        `SELECT m_a.*, m.fio 
          FROM membership_application m_a
          LEFT OUTER JOIN member m on m.id=m_a.member_id
          ORDER BY created_date DESC`,
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

  app.put('/membershipApplication/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { member_id } = req.body;
      pool.query(`INSERT INTO membership_application ( member_id) 
      VALUES(${member_id})`, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ success: false, message: error });
          return
        }
        res.send(result);
      });
    })
  app.post('/membershipApplication/:id/confirmPayment',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { id } = req.params;
      pool.query(
        `SELECT m_a.*
          FROM membership_application m_a
          WHERE id=${id}`,
        (error, result) => {
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
              const voting_results = result[0]?.voting_results

              let statusUpdateStatement = ''
              const positiveVotedMemberCount = Object.values(voting_results || {}).filter(item => item === 'yes').length
              if (voting_results && positiveVotedMemberCount > (boardMembersCount / 2)) {
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
                  res.send({ boardMembersCount, voting_results });
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
        (error, result) => {
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
              const voting_results = result[0]?.voting_results


              const newVotingResults = { ...(voting_results || {}), [currentUserMemberId]: vote }

              let statusUpdateStatement = ''
              const positiveVotedMemberCount = Object.values(newVotingResults).filter(item => item === 'yes').length
              if (positiveVotedMemberCount > (boardMembersCount / 2) && vote === 'yes') {
                statusUpdateStatement = `status='Принято',`
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
                  res.send(result);
                }
              );
            }
          );
        }
      );
    })
};

// Export the router
module.exports = membershipApplicationRouter;
