//const { pool } = require("../../../config/database");

const regexEmail = require('regex-email');

const contentDao = require('../dao/contentDao');
const { constants } = require('buffer');
//const Connection = require('mysql2/typings/mysql/lib/Connection');
const { logger } = require('../../config/winston');
const crypto = require('crypto')
const secret_config = require('C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/secret');
const jwt = require('jsonwebtoken')


/*
05.favoriteContent API = 내가 찜한 콘텐츠 화면
*/
exports.favoriteContent = async function (req, res) {
    
    const token = req.verifiedToken
    const userId = token.userID

    //const userID = req.params.userId;

    try {
        const [favoriteContentRows] = await contentDao.favoriteContentInfo(userId)

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
            code: 400,
            message: "내가 찜한 콘텐츠 조회 실패"
        });
    }
};

/*
06. mainFavoriteContent API = 메인 화면 - 내가 찜한 콘텐츠
*/
exports.mainFavoriteContent = async function (req, res) {

    const token = req.verifiedToken
    const userIndex = token.userIndex

    //const userIndex = req.params.userIndex;

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
            code: 400,
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
            code: 400,
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
            code: 400,
            message: "오늘 한국 TOP5 콘텐츠 조회 실패"
        });
    }
};

/*
09. netflixOriginalLatestContent API = 넷플릭스 오리지널 중 최신 콘텐츠
*/
exports.netflixOriginalLatestContent = async function (req, res) {
    try {
        const [netflixOriginalLatestContentRows] = await contentDao.netflixOriginalLatestContentInfo()

        return res.json({
            netflixOriginalLatestContentRows,
            isSuccess: true,
            code: 200,
            message: "넷플릭스 오리지널 중 최신 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - netflixOriginalLatestContent Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "넷플릭스 오리지널 중 최신 콘텐츠 조회 실패"
        });
    }
};

/*
10. recommendedContent API = 시청 완료한 콘텐츠와 비슷한 콘텐츠
*/
exports.recommendedContent = async function (req, res) {

    const token = req.verifiedToken
    const userIndex = token.userIndex

    //const userIndex = req.params.userIndex;

    try {
        const [recommendedContents] = await contentDao.recommendedContentInfo(userIndex)

        return res.json({
            recommendedContents,
            isSuccess: true,
            code: 200,
            message: "시청 완료한 콘텐츠와 비슷한 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - recommendedContent Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "시청 완료한 콘텐츠와 비슷한 콘텐츠 조회 실패"
        });
    }
};


/*
11. toBeReleasedContent API = 공개예정 콘텐츠 & 알람 여부
*/
exports.toBeReleasedContent = async function (req, res) {

    const token = req.verifiedToken
    const userIndex = token.userIndex

    //const userIndex = req.params.userIndex;

    try {
        const [toBeReleasedContents] = await contentDao.toBeReleasedContentInfo(userIndex)

        return res.json({
            toBeReleasedContents,
            isSuccess: true,
            code: 200,
            message: "공개예정 콘텐츠 & 알람 여부 조회 성공"
        });
    } catch (err) {
        logger.error(`App - toBeReleasedContent Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "공개예정 콘텐츠 & 알람 여부 조회 실패"
        });
    }
};

/*
12. maxSearchContent API = 검색화면 - 최다 검색 콘텐츠 TOP5
*/
exports.maxSearchContent = async function (req, res) {

    try {
        const [maxSearchContents] = await contentDao.maxSearchContentInfo()

        return res.json({
            maxSearchContents,
            isSuccess: true,
            code: 200,
            message: "검색화면 - 최다 검색 콘텐츠 TOP5 조회 성공"
        });
    } catch (err) {
        logger.error(`App - maxSearchContent Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "검색화면 - 최다 검색 콘텐츠 TOP5 조회 실패"
        });
    }
};

/*
13. savedContent API = 저장한 콘텐츠 목록
*/
exports.savedContent = async function (req, res) {
    const token = req.verifiedToken
    const userIndex1 = token.userIndex
    const userIndex2 = token.userIndex
    const userIndex3 = token.userIndex

    // const userIndex1 = req.params.userIndex;
    // const userIndex2 = req.params.userIndex;
    // const userIndex3 = req.params.userIndex;

    const savedContentParams = [userIndex1, userIndex2, userIndex3]

    try {
        const [savedContents] = await contentDao.savedContentInfo(savedContentParams)

        return res.json({
            savedContents,
            isSuccess: true,
            code: 200,
            message: "저장한 콘텐츠 목록 조회 성공"
        });
    } catch (err) {
        logger.error(`App - savedContent Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "저장한 콘텐츠 목록 조회 실패"
        });
    }
};

/*
14. savedContentDetail API = 저장한 콘텐츠 중 하나 자세히
*/
exports.savedContentDetail = async function (req, res) {

    const token = req.verifiedToken
    const userIndex1 = token.userIndex
    const userIndex2 = token.userIndex

    // const userIndex1 = req.params.userIndex;
    // const userIndex2 = req.params.userIndex;

    const savedContentParams = [userIndex1, userIndex2]

    try {
        const [savedContents] = await contentDao.savedContentDetailInfo(savedContentParams)

        return res.json({
            savedContents,
            isSuccess: true,
            code: 200,
            message: "저장한 콘텐츠 조회 성공"
        });
    } catch (err) {
        logger.error(`App - savedContent Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "저장한 콘텐츠 조회 실패"
        });
    }
};

/*
15. contentDetail API = 콘텐츠 상세 화면 정보
*/
exports.contentDetail = async function (req, res) {
    const contentsIndex1 = req.params.contentsIndex;
    const contentsIndex2 = req.params.contentsIndex;
    const contentsIndex3 = req.params.contentsIndex;
    const contentsIndex4 = req.params.contentsIndex;
    const contentsIndex5 = req.params.contentsIndex;
    const contentsIndex6 = req.params.contentsIndex;

    const token = req.verifiedToken
    const userIndex = token.userIndex

    //const userIndex = req.params.userIndex;

    const contentDetailParams = [contentsIndex1, contentsIndex2, contentsIndex3, contentsIndex4, contentsIndex5, contentsIndex6, userIndex]

    try {
        const [contentDetail] = await contentDao.contentDetailInfo(contentDetailParams)

        return res.json({
            contentDetail,
            isSuccess: true,
            code: 200,
            message: "콘텐츠 상세 화면 정보 조회 성공"
        });
    } catch (err) {
        logger.error(`App - contentDetail Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "콘텐츠 상세 화면 정보 조회 실패"
        });
    }
};

/*
16. contentDetailVideo API = // 콘텐츠 상세 화면 비디오 & 나의 기록
*/
exports.contentDetailVideo = async function (req, res) {
    const contentsIndex1 = req.params.contentsIndex;
    const contentsIndex2 = req.params.contentsIndex;
    const contentsIndex3 = req.params.contentsIndex;
    const contentsIndex4 = req.params.contentsIndex;
    const contentsIndex5 = req.params.contentsIndex;

    const token = req.verifiedToken
    const userIndex1 = token.userIndex
    const userIndex2 = token.userIndex
    const userIndex3 = token.userIndex

    // const userIndex1 = req.params.userIndex;
    // const userIndex2 = req.params.userIndex;
    // const userIndex3 = req.params.userIndex;

    const contentDetailVideoParams = [userIndex1, contentsIndex1, contentsIndex2, contentsIndex3, contentsIndex4, contentsIndex5, userIndex2, userIndex3]

    try {
        const [contentDetailVideo] = await contentDao.contentDetailVideoInfo(contentDetailVideoParams)

        return res.json({
            contentDetailVideo,
            isSuccess: true,
            code: 200,
            message: "콘텐츠 상세 화면 비디오 & 나의 기록 조회 성공"
        });
    } catch (err) {
        logger.error(`App - contentDetailVideo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "콘텐츠 상세 화면 비디오 & 나의 기록 조회 실패"
        });
    }
};

/*
17. contentMore API = // 콘텐츠 더보기
*/
exports.contentMore = async function (req, res) {
    const contentsIndex1 = req.params.contentsIndex;
    const contentsIndex2 = req.params.contentsIndex;
    const contentsIndex3 = req.params.contentsIndex;

    const contentMoreParams = [contentsIndex1, contentsIndex2, contentsIndex3]

    try {
        const [contentMoreRows] = await contentDao.contentMoreInfo(contentMoreParams)

        return res.json({
            contentMoreRows,
            isSuccess: true,
            code: 200,
            message: "콘텐츠 더보기 조회 성공"
        });
    } catch (err) {
        logger.error(`App - contentMore Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "콘텐츠 더보기 조회 실패"
        });
    }
};