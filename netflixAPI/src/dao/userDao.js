const { pool } = require("C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/database");

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

// 로그인 아이디, 비밀번호 확인
async function selectUserInfo(userID, password) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserInfoQuery = `
                        SELECT userName, userProfileImageURL, userEmail
                        FROM User
                        WHERE userID = ? AND password = ?;
                        `;

    let selectUserInfoParams = [userID, password];
    const [userInfoRows] = await connection.query(
        selectUserInfoQuery,
        selectUserInfoParams
    )
    return [userInfoRows];
}

// 로그인 아이디 확인
async function selectUserIDInfo(userID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserIDInfoQuery = `
                        SELECT userName, userProfileImageURL, userEmail
                        FROM User
                        WHERE userID = ?;
                        `;

    let selectUserIDInfoParams = [userID];
    const [userIDInfoRows] = await connection.query(
        selectUserIDInfoQuery,
        selectUserIDInfoParams
    )
    return [userIDInfoRows];
}

// 로그인 비밀번호 확인
async function selectPasswordInfo(password) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectPasswordInfoQuery = `
                        SELECT userName, userProfileImageURL, userEmail
                        FROM User
                        WHERE password = ?;
                        `;

    let selectPasswordParams = [password];
    const [passwordInfoRows] = await connection.query(
        selectPasswordInfoQuery,
        selectPasswordParams
    )
    return [passwordInfoRows];
}

// 사용자 프로필사진, 닉네임 가져오기
async function selectUserProfileInfo(userID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserProfileInfoQuery = `
                            SELECT userName, userProfileImageURL
                            FROM User
                            WHERE userID = ?;
                        `;

    let selectUserProfileInfoParams = [userID];
    const [userProfileInfoRows] = await connection.query(
        selectUserProfileInfoQuery,
        selectUserProfileInfoParams
    )
    return [userProfileInfoRows];
}

// 사용자 프로필사진, 닉네임 가져오기
async function selectAllUserInfo() {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserInfoQuery = `
                            SELECT *
                            FROM User;
                        `;

    const [userInfoRows] = await connection.query(
        selectUserInfoQuery
    )
    return [userInfoRows];
}

module.exports = {
    userIDCheck,
    userEmailCheck,
    insertUserInfo,
    selectUserInfo,
    selectUserIDInfo,
    selectPasswordInfo,
    selectUserProfileInfo,
    selectAllUserInfo,
};