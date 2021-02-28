const { pool } = require("C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/database");

/*
01.signUp API = 회원가입
*/
// 아이디 중복 확인
async function userIDCheck(userID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserIDQuery =   `
                    SELECT userID, userEmail
                    FROM User
                    WHERE userID = ?;
                    `;
    const selectUserIDParams = [userID];
    const [userIDRows] = await connection.query(
        selectUserIDQuery,
        selectUserIDParams
    );
    connection.release();

    return userIDRows;
}

// 이메일 중복 확인
async function userEmailCheck(userEmail) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserEmailQuery =   `
                    SELECT userID, userEmail
                    FROM User
                    WHERE userEmail = ?;
                    `;
    const selectUserEmailParams = [userEmail];
    const [userEmailRows] = await connection.query(
        selectUserEmailQuery,
        selectUserEmailParams
    );
    connection.release();

    return userEmailRows;
}

// 회원 생성(회원가입 완료)
async function insertUserInfo(insertUserInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const insertUserInfoQuery = `
                    INSERT INTO User(userID, userEmail, password, userName)
                    VALUES (?, ?, ?, ?);
                    `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );
    connection.release();
    return insertUserInfoRow;
}

module.exports = {
    userIDCheck,
    userEmailCheck,
    insertUserInfo,
}