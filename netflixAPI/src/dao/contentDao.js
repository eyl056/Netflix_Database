const { pool } = require("C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/database");

// 내가 찜한 콘텐츠 화면
async function favoriteContentInfo(userID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectFavoriteContentInfoQuery =   `
                    SELECT contentsPosterURL,
                            updateTime,
                            distributeCompany,
                            top5
                    FROM Contents, LikeContents, User
                    WHERE Contents.contentsIndex = LikeContents.contentsIndex AND
                    User.userID = ? and isLiked = 'Y';
                    `;
    const selectFavoriteContentInfoParams = [userID];
    const favoriteContentRows = await connection.query(
        selectFavoriteContentInfoQuery,
        selectFavoriteContentInfoParams
    );
    connection.release();

    return favoriteContentRows;
}

// 메인화면 - 내가 찜한 콘텐츠 화면
async function mainFavoriteContentInfo(userIndex) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectMainFavoriteContentInfoQuery =   `
                                        SELECT Contents.contentsPosterURL, top5, updateTime, distributeCompany
                                        FROM Contents
                                            inner join (
                                                select contentsIndex, updatedAt
                                                from LikeContents
                                                where userIndex = ? and isLiked = 'Y'
                                            ) LikedContents
                                        WHERE LikedContents.contentsIndex = Contents.contentsIndex
                                        ORDER BY LikedContents.updatedAt DESC;
                                        `;
    const selectMainFavoriteContentInfoParams = [userIndex];
    const mainFavoriteContentRows = await connection.query(
        selectMainFavoriteContentInfoQuery,
        selectMainFavoriteContentInfoParams
    );
    connection.release();

    return mainFavoriteContentRows;
}

// 메인화면 - 지금 뜨는 콘텐츠
async function popularContentInfo() {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectPopularContentQuery =   `
                                    SELECT contentsPosterURL, updateTime, top5, distributeCompany
                                    FROM Contents
                                    ORDER BY searchNum desc limit 5;
                                        `;
    const popularContentRows = await connection.query(
        selectPopularContentQuery
    );
    connection.release();

    return popularContentRows;
}

module.exports = {
    favoriteContentInfo,
    mainFavoriteContentInfo,
    popularContentInfo,
};