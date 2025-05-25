// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const trainingProgramRouter = (app, passport) => {

    app.get(
        "/trainingProgram",
        passport.authenticate("jwt", { session: false }),
        (req, res) => {
            pool.query(`SELECT * FROM progr_pod`, (error, resultAll) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                }
                pool.query(
                    `SELECT prog_razd FROM progr_pod GROUP BY prog_razd`,
                    (error, resultUnique) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ success: false, message: error });
                            return;
                        }
                        const returnType = req.query.returnType;
                        if (returnType == "objectType") {
                            const newResult = {};
                            resultAll.forEach((item) => {
                                newResult[item.id] = { ...item, name: item.prog_tem, parent: item.prog_razd };
                            });
                            res.send({
                                data: newResult,
                                razdelList: resultUnique.map((item) => item.prog_razd),
                            });
                        } else {
                            res.send(
                                resultAll,
                            );
                        }

                    }
                );
            });
        }
    );
};

// Export the router
module.exports = trainingProgramRouter;
