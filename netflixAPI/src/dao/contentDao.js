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

// 검색화면 - 최다 검색 콘텐츠 TOP5
async function maxSearchContentInfo() {
    const connection = await pool.getConnection(async (conn) => conn);
    const maxSearchContentQuery =   `
                                    select contentsPosterURL, contentsImageURL, top5,
                                            distributeCompany, updateTime,contentsName
                                    from Contents
                                    order by searchNum desc limit 5;
                                        `;

    const maxSearchContentRows = await connection.query(
        maxSearchContentQuery
    );
    connection.release();

    return maxSearchContentRows;
}

// 저장한 콘텐츠 목록
async function savedContentInfo(savedContentParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const savedContentQuery =   `
                    select distinct contentsPosterURL,
                            distributeCompany,
                            contentsName, rating, count,
                            userProfileImageURL, userName, smartSave,
                                    totalCapacity,
                            IF(EXISTS(select * where isSaved = 'M'),'M', 'Y' ) ingSave
                    from Contents
                        inner join (
                            select distinct contentsIndex, count, isSaved,
                                            userProfileImageURL, userName, smartSave
                            from SaveVideo
                                inner join(
                                    select COUNT(*) as count
                                    from SaveVideo
                                    where userIndex = ? and isSaved in ('M', 'Y')
                                    group by contentsIndex
                                ) CountVideo
                                inner join (
                                    select userProfileImageURL, userName, smartSave
                                    from User
                                    where userIndex = ?
                                ) SmartSaveUser
                            where userIndex = ? and isSaved in ('M', 'Y')
                        ) Saving
                        inner join (
                            select SUM(capacity) as totalCapacity
                            from Video
                                inner join (
                                    select videoIndex
                                    from SaveVideo
                                    where isSaved = 'Y'
                                ) Capacity
                            where Capacity.videoIndex = Video.videoIndex
                        ) Capacity2
                    where Saving.contentsIndex = Contents.contentsIndex;
                                        `;
                             
    const savedContentRows = await connection.query(
        savedContentQuery,
        savedContentParams
    );
    connection.release();

    return savedContentRows;
}

// 저장한 콘텐츠 중 하나 자세히
async function savedContentDetailInfo(savedContentDetailParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const savedContentDetailQuery =   `
                            select distinct videoName, videoLength, capacity, isSaved
                            from Video
                                inner join (
                                    select videoIndex
                                    from SaveVideo
                                    where userIndex = ? and isSaved = 'Y'
                                ) SaveVideoDetail
                                inner join (
                                    select isSaved, videoIndex
                                    from SaveVideo
                                    where userIndex = ? and isSaved = 'Y' or isSaved = 'M'
                                ) Saved
                            where SaveVideoDetail.videoIndex = Video.videoIndex and
                                Saved.videoIndex = Video.videoIndex;
                                        `;
                             
    const savedContentDetailRows = await connection.query(
        savedContentDetailQuery,
        savedContentDetailParams
    );
    connection.release();

    return savedContentDetailRows;
}

// 콘텐츠 상세 화면 정보
async function contentDetailInfo(contentDetailParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const contentDetailQuery =   `
                        select userProfileImageURL,
                            preview,
                            distributeCompany,
                            contentsName,
                            ANY_VALUE(year(openingDate)) as openingYear,
                            ANY_VALUE(concat('시즌 ',seasonNum,'개')) as seasonNum,
                            highDefinition,
                            rating,
                            ANY_VALUE(seasonName) as seasonName,
                            ANY_VALUE(videoName) as VideoName,
                            introduction,
                            ANY_VALUE(watchLength) as watchLength,
                            ANY_VALUE(videoIntro) as videoIntro,
                            ANY_VALUE(GROUP_CONCAT(distinct performerName SEPARATOR ', ')) as performers,
                            ANY_VALUE(directorName) as directorName
                        from Performer, Director, Contents, User, Video
                        inner join (
                            select ANY_VALUE(ContentsSeason.seasonName) as seasonName, ANY_VALUE(count(distinct contentsIndex)) as seasonNum
                            from ContentsSeason
                            where ContentsSeason.contentsIndex = ?
                        ) Season
                        inner join (
                            select isWatched, WatchVideo.videoIndex, watchLength
                            from WatchVideo
                                inner join (
                                    select videoIndex
                                    from Video
                                    where contentsIndex = ?
                                ) VideoDetail
                            where VideoDetail.videoIndex = WatchVideo.videoIndex
                            order by watchTime desc
                        ) Watched
                        where Performer.contentsIndex = ? and
                        Director.contentsIndex = ? and
                        Contents.contentsIndex = ? and
                        Video.contentsIndex = ? and
                        userIndex = ?;
                                        `;
                             
    const contentDetailRows = await connection.query(
        contentDetailQuery,
        contentDetailParams
    );
    connection.release();

    return contentDetailRows;
}

// 콘텐츠 상세 화면 비디오 & 나의 기록
async function contentDetailVideoInfo(contentDetailVideoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const contentDetailVideoQuery =   `
                            select distinct seasonName,
                                            videoURL,
                                            thumbnailImageURL,
                                            videoName,
                                            videoIntro,
                                            videoLength,
                                            watchTime,
                                            isSaved
                            from Video
                                inner join (
                                    select distinct *
                                    from WatchVideo
                                    where userIndex = ?
                                ) WatchVideo
                                inner join SaveVideo
                                inner join (
                                    select distinct seasonName, contentsIndex, videoIndex
                                    from ContentsSeason
                                    where contentsIndex = ?
                                ) ContentsSeason
                            where Video.contentsIndex = ? and
                                WatchVideo.contentsIndex = ? and
                                SaveVideo.contentsIndex = ? and
                                Video.videoIndex = WatchVideo.videoIndex and
                                SaveVideo.videoIndex = Video.videoIndex and
                                WatchVideo.videoIndex = Video.videoIndex and
                                ContentsSeason.videoIndex = Video.videoIndex and
                                ContentsSeason.contentsIndex = ? and
                                SaveVideo.userIndex = ? and
                                WatchVideo.userIndex = ?;
                                        `;
                             
    const contentDetailVideoRows = await connection.query(
        contentDetailVideoQuery,
        contentDetailVideoParams
    );
    connection.release();

    return contentDetailVideoRows;
}

// 콘텐츠 더보기
async function contentMoreInfo(contentMoreParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const contentMoreQuery =   `
                        select Contents.contentsName,
                            GROUP_CONCAT(distinct performerName SEPARATOR ', ') as performers,
                            GROUP_CONCAT(distinct directorName SEPARATOR ', ') as directors,
                            rating,
                            genre,
                            feature
                        from Contents, Performer, Director
                        where Performer.contentsIndex = ? and
                        Contents.contentsIndex = ? and
                        Director.contentsIndex = ?;
                                        `;
                             
    const contentMoreRows = await connection.query(
        contentMoreQuery,
        contentMoreParams
    );
    connection.release();

    return contentMoreRows;
}

module.exports = {
    favoriteContentInfo,
    mainFavoriteContentInfo,
    popularContentInfo,
    todayTop5ContentInfo,
    netflixOriginalLatestContentInfo,
    recommendedContentInfo,
    toBeReleasedContentInfo,
    maxSearchContentInfo,
    savedContentInfo,
    savedContentDetailInfo,
    contentDetailInfo,
    contentDetailVideoInfo,
    contentMoreInfo,
};