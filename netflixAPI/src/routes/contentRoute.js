module.exports = function(app) {
    const content = require('../controllers/contentController');
    const jwtMiddleware = require('C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/jwtMiddleware');
    
    app.get('/app/content/favoriteContent/:userId', jwtMiddleware, content.favoriteContent); // 내가 찜한 콘텐츠 화면

    app.get('/app/content/mainFavoriteContent/:userIndex', jwtMiddleware, content.mainFavoriteContent); // 메인화면 - 내가 찜한 콘텐츠

    app.get('/app/content/popularContent', content.popularContent); // 메인화면 - 지금 뜨는 콘텐츠

    app.get('/app/content/todayTop5Content', content.todayTop5Content); // 오늘 한국 TOP5 콘텐츠

    app.get('/app/content/netflixOriginalLatestContent', content.netflixOriginalLatestContent); // 넷플릭스 오리지널 중 최신 콘텐츠

    app.get('/app/content/recommendedContent/:userIndex', jwtMiddleware, content.recommendedContent); // 시청 완료한 콘텐츠와 비슷한 콘텐츠

    app.get('/app/content/toBeReleasedContent/:userIndex', jwtMiddleware, content.toBeReleasedContent); // 공개예정 콘텐츠 & 알람 여부

    app.get('/app/content/maxSearchContent', content.maxSearchContent); // 검색화면 - 최다 검색 콘텐츠 TOP5

    app.get('/app/content/savedContent/:userIndex', jwtMiddleware, content.savedContent); // 저장한 콘텐츠 목록

    app.get('/app/content/savedContent/Detail/:userIndex', jwtMiddleware, content.savedContentDetail); // 저장한 콘텐츠 중 하나 자세히

    app.get('/app/content/contentDetail/:contentsIndex/:userIndex', jwtMiddleware, content.contentDetail); // 콘텐츠 상세 화면 정보

    app.get('/app/content/contentDetailVideo/:contentsIndex/:userIndex', jwtMiddleware, content.contentDetailVideo); // 콘텐츠 상세 화면 비디오 & 나의 기록

    app.get('/app/content/contentMore/:contentsIndex', content.contentMore); // 콘텐츠 더보기
}