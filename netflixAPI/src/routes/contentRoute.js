module.exports = function(app) {
    const content = require('../controllers/contentController');
    
    app.get('/app/content/favoriteContent/:userId', content.favoriteContent); // 내가 찜한 콘텐츠 화면
    app.get('/app/content/mainFavoriteContent/:userIndex', content.mainFavoriteContent); // 메인화면 - 내가 찜한 콘텐츠

    app.get('/app/content/popularContent', content.popularContent); // 메인화면 - 지금 뜨는 콘텐츠

    app.get('/app/content/todayTop5Content', content.todayTop5Content); // 오늘 한국 TOP5 콘텐츠

    app.get('/app/content/netflixOriginalLatestContent', content.netflixOriginalLatestContent); // 넷플릭스 오리지널 중 최신 콘텐츠

    app.get('/app/content/recommendedContent/:userIndex', content.recommendedContent); // 시청 완료한 콘텐츠와 비슷한 콘텐츠

    app.get('/app/content/toBeReleasedContent/:userIndex', content.toBeReleasedContent); // 공개예정 콘텐츠 & 알람 여부

    app.get('/app/content/maxSearchContent', content.maxSearchContent); // 검색화면 - 최다 검색 콘텐츠 TOP5
}