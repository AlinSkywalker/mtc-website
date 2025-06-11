// Load the MySQL pool connection
const pool = require("../mysql");

// Route the app
const trainingProgramRouter = (app, passport) => {

    app.get(
        "/trainingProgram",
        passport.authenticate("jwt", { session: false }),
        (req, res) => {
            pool.query(`SELECT * FROM progr_pod_razd`, (error, resultAll) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                    return;
                }
                pool.query(
                    `SELECT * FROM progr_pod_razd`,
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
                                newResult[item.id] = { ...item, name: item.prog_razd };
                            });
                            res.send({
                                data: newResult,

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
