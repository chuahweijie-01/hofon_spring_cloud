const connectionPool = require('../../conf/db');

exports.insertAnalysisData = () => {
    var connection, analysis_id;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            //General info { user_id: user_id, analysis_date: analysis_date }
            return connection.query(`INSERT INTO analysisdb.analysis SET ?`, [analysis_info])
        })
        .then((result) => {
            analysis_id = result[0].insertId;
            //Acne info { analysis_id: analysis_id, acne_result: acne_result, image: acne_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.acne SET ?`, [acne_info])
        })
        .then((result) => {
            //Deepspot info { analysis_id: analysis_id, deepspot_result: deepspot_result, image: deepspot_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.deepspot SET ?`, [deepspot_info])
        })
        .then((result) => {
            //Dark circles info { analysis_id: analysis_id, dark_circles_result: dark_circles_result, image: dark_circles_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.dark_circles SET ?`, [dark_circles_info])
        })
        .then((result) => {
            //Brownspot info { analysis_id: analysis_id, brownspot_result: brownspot_result, image: brownspot_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.brownspot SET ?`, [brownspot_info])
        })
        .then((result) => {
            //Grain info { analysis_id: analysis_id, grain_result: grain_result, image: grain_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.grain SET ?`, [grain_info])
        })
        .then((result) => {
            //Horny info { analysis_id: analysis_id, horny_result: horny_result, image: horny_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.horny SET ?`, [horny_info])
        })
        .then((result) => {
            //Pore info { analysis_id: analysis_id, pore_result: pore_result, image: pore_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.pore SET ?`, [pore_info])
        })
        .then((result) => {
            //Sensitive info { analysis_id: analysis_id, sensitive_result: sensitive_result, image: sensitive_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.sensitive SET ?`, [sensitive_info])
        })
        .then((result) => {
            //Whitening info { analysis_id: analysis_id, whitening_result: whitening_result, image: whitening_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.whitening SET ?`, [whitening_info])
        })
        .then((result) => {
            //Wrinkle info { analysis_id: analysis_id, wrinkle_result: wrinkle_result, image:  wrinkle_image }
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO analysisdb.wrinkle SET ?`, [wrinkle_info])
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}