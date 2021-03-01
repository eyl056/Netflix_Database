//const { pool } = require("../../../config/database");

const regexEmail = require('regex-email');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');
//const Connection = require('mysql2/typings/mysql/lib/Connection');
const { logger } = require('../../config/winston');
const crypto = require('crypto')
const { pool } = require('../../config/database');
const secret_config = require('C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/secret');
const jwt = require('jsonwebtoken')

/*
01.signUp API = 회원가입
*/
exports.signUp = async function (req, res) {
    const {
        userID, userEmail, password, userName
    } = req.body;

    if (!userID) return res.json({
        isSuccess: false,
        code: 301, 
        message: "아이디를 입력해주세요."
    });

    if(userID.length > 20) return res.json({
        isSuccess:false,
        code: 305,
        message: "아이디는 20자 미만으로 입력해주세요."
    });

    if (!userEmail) return res.json({
        isSuccess: false,
        code: 301, 
        message: "이메일을 입력해주세요."
    });

    if(!regexEmail.test(userEmail)) return res.json({
        isSuccess:false,
        code: 303,
        message: "이메일 형식을 정확하게 입력해주세요."
    });

    if(!password) return res.json({
        isSuccess: false,
        code: 304,
        message: "비밀번호를 입력해주세요."
    });

    if(password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 307, 
        message: "비밀번호는 6자 이상 20자 미만으로 입력해주세요."
    });

    if(!userName) return res.json({
        isSuccess: false,
        code: 304,
        message: "닉네임을 입력해주세요."
    });

    if(userName.length > 10) return res.json({
        isSuccess: false,
        code: 307, 
        message: "닉네임은 10자 이하로 입력해주세요."
    });

    try {
        const connection = await pool.getConnection(async (conn) => conn)

        // 아이디 중복 확인
        const userIDRows = await userDao.userIDCheck(userID);
        if(userIDRows.length > 0) {
            return res.json({
                isSuccess: false,
                code: 308,
                message: "이미 사용 중인 아이디입니다."
            });
        }

        // 이메일 중복 확인
        const userEmailRows = await userDao.userEmailCheck(userEmail);
        if(userEmailRows.length > 0) {
            return res.json({
                isSuccess: false,
                code: 309,
                message: "이미 가입된 이메일입니다."
            });
        }

        await connection.beginTransaction()
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex')

        const insertUserInfoParams = [userID, userEmail, hashedPassword, userName];
        const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);

        // await connection.commit(); // COMMIT
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 201,
            message: "회원가입 성공"
        });

    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
        return res.status(500).send(`Error: ${err.message}`)
    }
};

/*
02.signIn API = 로그인
*/
exports.signIn = async function (req, res) {
    const {
        userID, password
    } = req.body;

    if (!userID) return res.json({
        isSuccess: false,
        code: 301, 
        message: "아이디를 입력해주세요."
    });

    if(userID.length > 20) return res.json({
        isSuccess:false,
        code: 305,
        message: "아이디는 20자 미만으로 입력해주세요."
    });

    if(!password) return res.json({
        isSuccess: false,
        code: 304,
        message: "비밀번호를 입력해주세요."
    });

    if(password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 307, 
        message: "비밀번호는 6자 이상 20자 미만으로 입력해주세요."
    });

    try {
        const connection = await pool.getConnection(async (conn) => conn)

        const [userIDInfoRows] = await userDao.selectUserIDInfo(userID)

        if (userIDInfoRows[0] == null) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "아이디를 다시 입력해주세요."
            });
        }

        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex')
        const [passwordInfoRows] = await userDao.selectPasswordInfo(hashedPassword)

        if (passwordInfoRows[0] == null) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "비밀번호를 다시 입력해주세요."
            });
        }

        const [userInfoRows] = await userDao.selectUserInfo(userID, hashedPassword)

        if (userInfoRows[0] == null) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "일치하는 회원정보가 없습니다. 회원가입을 먼저 해주세요."
            });
        }
        else {
            // 토큰 생성
            let token = await jwt.sign({
                    userID: userInfoRows[0].userID
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀 키
                {
                    expiresIn: '365d',
                    subject: 'userInfo',
                } // 유효 시간은 365일
            );

            return res.json({
                userInfo: userInfoRows[0],
                jwt: token,
                isSuccess: true,
                code: 201,
                message: "로그인 성공"
            });
        }
        
    } catch (err) {
        logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return false;
    }
};

/**
 20.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};

/*
03. userProfile API = 유저 프로필 정보
*/
exports.userProfileInfo = async function (req, res) {
    
    const userID = req.params.userId;
    
    try {
        const [userProfileInfoRows] = await userDao.selectUserProfileInfo(userID)

        return res.json({
            userInfo: userProfileInfoRows,
            isSuccess: true,
            code: 200,
            message: "유저 프로필 정보 조회 성공"
        });
    } catch (err) {
        logger.error(`App - userProfileInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "유저 프로필 정보 조회 실패"
        });
    }
};

/*
19. userInfo API = 특정 유저 정보
*/
exports.userInfo = async function (req, res) {

    const userID = req.params.userId;
    
    try {
        const [userInfoRows] = await userDao.userInfoQuery(userID)

        return res.json({
            userInfo: userInfoRows[0],
            isSuccess: true,
            code: 200,
            message: "특정 유저 정보 조회 성공"
        });
    } catch (err) {
        logger.error(`App - userInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "특정 유저 정보 조회 실패"
        });
    }
};

/*
20. myInfo API = 내 정보
*/
exports.myInfo = async function (req, res) {

    const token = req.verifiedToken
    const userId = token.userID
    logger.info(` token check ${token.userID}`);
    
    try {
        //const connection = await pool.getConnection(async (conn) => conn)
        const [userInfoRows] = await userDao.userInfoQuery(userId)

        //connection.release()
        return res.json({
            userInfo: [userInfoRows],
            isSuccess: true,
            code: 200,
            message: "내 정보 조회 성공"
        });
    } catch (err) {
        logger.error(`App - myInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "내 정보 조회 실패"
        });
    }
};

/*
04. userInfo API = 전체 회원 정보
*/
exports.allUserInfo = async function (req, res) {
    try {
        const [userInfoRows] = await userDao.selectAllUserInfo()

        return res.json({
            allUserInfo: userInfoRows,
            isSuccess: true,
            code: 200,
            message: "전체 회원 조회 성공"
        });
    } catch (err) {
        logger.error(`App - allUserInfo Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return res.json({
            isSuccess: false,
            code: 400,
            message: "전체 회원 조회 실패"
        });
    }
};