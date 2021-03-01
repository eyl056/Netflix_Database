const { pool } = require("C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/database");

// 출연자 정보
async function performerInfo(performerID) {
    const connection = await pool.getConnection(async (conn) => conn);
    const performerInfoQuery =   `
                    select performerName,
                        contentsPosterURL,
                        updateTime,
                        distributeCompany,
                        top5
                    from Contents
                    inner join (
                        select distinct performerID,
                                        performerName,
                                        contentsIndex
                        from Performer
                    ) Performer
                    where Performer.performerID = ? and
                    Contents.contentsIndex = Performer.contentsIndex;
                    `;
    const performerInfoParams = [performerID];
    const [performerInfoRows] = await connection.query(
        performerInfoQuery,
        performerInfoParams
    );
    connection.release();

    return performerInfoRows;
}

module.exports = {
    performerInfo,
};