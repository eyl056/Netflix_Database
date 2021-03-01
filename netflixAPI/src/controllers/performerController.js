//const { pool } = require("../../../config/database");

const regexEmail = require('regex-email');

const performerDao = require('../dao/performerDao');
const { constants } = require('buffer');
//const Connection = require('mysql2/typings/mysql/lib/Connection');
const { logger } = require('../../config/winston');

/*
18. performerInfo API = 출연자 정보
*/
exports.performerDetailInfo = async function (req, res) {
    const performerID = req.params.performerID;

    try {
        const performerInfoRows = await performerDao.performerInfo(performerID)

        return res.json({
            performerInfoRows,
            isSuccess: true,
            code: 200,
            message: "출연자 정보 조회 성공"
        });
    } catch (err) {
        logger.error(`App - performerInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "출연자 정보 조회 실패"
        });
    }
};