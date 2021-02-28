//const { pool } = require("../../../config/database");

const regexEmail = require('regex-email');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');
//const Connection = require('mysql2/typings/mysql/lib/Connection');
const { logger } = require('../../config/winston');

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

        const insertUserInfoParams = [userID, userEmail, password, userName];
        const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);

        // await connection.commit(); // COMMIT
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
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
        const [userIDInfoRows] = await userDao.selectUserIDInfo(userID)

        if (userIDInfoRows[0] == null) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "아이디를 다시 입력해주세요."
            });
        }

        const [passwordInfoRows] = await userDao.selectPasswordInfo(password)

        if (passwordInfoRows[0] == null) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "비밀번호를 다시 입력해주세요."
            });
        }

        const [userInfoRows] = await userDao.selectUserInfo(userID, password)

        if (userInfoRows[0] == null) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "일치하는 회원정보가 없습니다. 회원가입을 먼저 해주세요."
            });
        }
        else {
            return res.json({
                userInfo: userInfoRows[0],
                isSuccess: true,
                code: 200,
                message: "로그인 성공"
            });
        }
        
    } catch (err) {
        logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return false;
    }
};