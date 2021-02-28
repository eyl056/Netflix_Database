module.exports = function(app) {
    const content = require('../controllers/contentController');
    
    app.get('/app/content/favoriteContent/:userId', content.favoriteContent); // 내가 찜한 콘텐츠 화면
    app.get('/app/content/mainFavoriteContent/:userIndex', content.mainFavoriteContent); // 메인화면 - 내가 찜한 콘텐츠

    app.get('/app/content/popularContent', content.popularContent); // 메인화면 - 지금 뜨는 콘텐츠

    app.get('/app/content/todayTop5Content', content.todayTop5Content); // 오늘 한국 TOP5 콘텐츠
}