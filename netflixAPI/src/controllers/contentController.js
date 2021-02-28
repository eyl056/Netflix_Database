//const { pool } = require("../../../config/database");

const regexEmail = require('regex-email');

const contentDao = require('../dao/contentDao');
const { constants } = require('buffer');
//const Connection = require('mysql2/typings/mysql/lib/Connection');
const { logger } = require('../../config/winston');


/*
05.favoriteContent API = 내가 찜한 콘텐츠 화면
*/
exports.favoriteContent = async function (req, res) {
    const userID = req.params.userId;

    try {
        const [favoriteContentRows] = await contentDao.favoriteContentInfo(userID)

        return res.json({
            contentsInfo: favoriteContentRows,
            isSuccess: true,
            code: 200,
            message: "내가 찜한 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - favoriteContentInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 200,
            message: "내가 찜한 콘텐츠 조회 실패"
        });
    }
};

/*
06. mainFavoriteContent API = 메인 화면 - 내가 찜한 콘텐츠
*/
exports.mainFavoriteContent = async function (req, res) {
    const userIndex = req.params.userIndex;

    try {
        const [mainFavoriteContentRows] = await contentDao.mainFavoriteContentInfo(userIndex)

        return res.json({
            contentsInfo: mainFavoriteContentRows,
            isSuccess: true,
            code: 200,
            message: "메인 - 내가 찜한 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - mainFavoriteContentInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 200,
            message: "메인 - 내가 찜한 콘텐츠 조회 실패"
        });
    }
};

/*
07. popularContent API = 메인 화면 - 지금 뜨는 콘텐츠 ( 검색수 TOP 5)
*/
exports.popularContent = async function (req, res) {
    try {
        const [popularContentRows] = await contentDao.popularContentInfo()

        return res.json({
            popularContentRows,
            isSuccess: true,
            code: 200,
            message: "메인 - 지금 뜨는 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - popularContentInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 200,
            message: "메인 - 지금 뜨는 콘텐츠 조회 실패"
        });
    }
};

/*
08. todayTop5 API = 오늘 한국 TOP5 콘텐츠
*/
exports.todayTop5Content = async function (req, res) {
    try {
        const [todayTop5ContentRows] = await contentDao.todayTop5ContentInfo()

        return res.json({
            todayTop5ContentRows,
            isSuccess: true,
            code: 200,
            message: "오늘 한국 TOP5 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - todayTop5Content Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 200,
            message: "오늘 한국 TOP5 콘텐츠 조회 실패"
        });
    }
};