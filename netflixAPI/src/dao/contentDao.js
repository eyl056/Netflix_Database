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

// 오늘 한국 TOP5 콘텐츠
async function todayTop5ContentInfo() {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectTodayTop5ContentQuery =   `
                                SELECT contentsPosterURL, updateTime, top5, distributeCompany
                                FROM Contents
                                WHERE top5 = 'Y'
                                ORDER BY watchNum DESC;
                                        `;
    const todayTop5ContentRows = await connection.query(
        selectTodayTop5ContentQuery
    );
    connection.release();

    return todayTop5ContentRows;
}

// 넷플릭스 오리지널 중 최신 콘텐츠
async function netflixOriginalLatestContentInfo() {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectNetflixOriginalLatestContentQuery =   `
                                    select contentsPosterURL
                                    from Contents
                                    where distributeCompany = 'netflix'
                                    order by updatedAt desc;
                                        `;
    const netflixOriginalLatestContentRows = await connection.query(
        selectNetflixOriginalLatestContentQuery
    );
    connection.release();

    return netflixOriginalLatestContentRows;
}

// 시청 완료한 콘텐츠와 비슷한 콘텐츠
async function recommendedContentInfo(userIndex) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectRecommendedContentQuery =   `
                    select distinct contentsPosterURL, top5, distributeCompany, updateTime,
                    genreRandom.watchedContentsName
                from Contents
                inner join (
                    select
                        substring_index(substring_index(selectedGenre.genre, ',', 1),',',-1) genre1,
                        substring_index(substring_index(selectedGenre.genre, ',', 2),',',-1) genre2,
                        substring_index(substring_index(selectedGenre.genre, ',', 3),',',-1) genre3,
                        substring_index(substring_index(selectedGenre.genre, ',', 4),',',-1) genre4,
                        selectedGenre.contentsName as watchedContentsName
                    from(
                        select genre, contentsName
                        from Contents
                            inner join (
                                select contentsIndex
                                from Video
                                    inner join (
                                        select videoIndex
                                        from WatchVideo
                                        where userIndex = ? AND isWatched = 'Y' order by rand() limit 1
                                    ) RandomVideo on RandomVideo.videoIndex = Video.videoIndex
                            ) RandomContent on RandomContent.contentsIndex = Contents.contentsIndex) selectedGenre
                ) genreRandom
                inner join LikeContents as LC
                where find_in_set(genreRandom.genre1,Contents.genre) or
                find_in_set(genreRandom.genre2,Contents.genre) or
                find_in_set(genreRandom.genre3,Contents.genre)
                order by rand() limit 10;
                                        `;
    const recommendedContentParams = [userIndex];
    const recommendedContentRows = await connection.query(
        selectRecommendedContentQuery,
        recommendedContentParams
    );
    connection.release();

    return recommendedContentRows;
}

// 공개예정 콘텐츠 & 알람 여부
async function toBeReleasedContentInfo(userIndex) {
    const connection = await pool.getConnection(async (conn) => conn);
    const toBeReleasedContentQuery =   `
                                select preview, contentsImageURL,
                                isAlarmed, openingNetflix,
                                contentsName, introduction,
                                genre, feature, distributeCompany
                            from Contents
                            inner join (
                                select isAlarmed, Mopen.contentsIndex
                                from alarmContents
                                    inner join (
                                        select contentsIndex
                                        from Contents
                                        where open = 'M'
                                    ) Mopen
                                where Mopen.contentsIndex = alarmContents.contentsIndex and
                                    userIndex = ?
                            ) MMopen
                            where MMopen.contentsIndex = Contents.contentsIndex;
                                        `;
    const toBeReleasedContentParams = [userIndex];                                    
    const toBeReleasedContentRows = await connection.query(
        toBeReleasedContentQuery,
        toBeReleasedContentParams
    );
    connection.release();

    return toBeReleasedContentRows;
}

module.exports = {
    favoriteContentInfo,
    mainFavoriteContentInfo,
    popularContentInfo,
    todayTop5ContentInfo,
    netflixOriginalLatestContentInfo,
    recommendedContentInfo,
    toBeReleasedContentInfo,
};