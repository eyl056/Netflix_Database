module.exports = function(app) {
    const user = require('../controllers/contentController');
    
    app.get('/app/content/favoriteContent/:userId', user.favoriteContent); // 내가 찜한 콘텐츠 화면
    app.get('/app/content/mainFavoriteContent/:userIndex', user.mainFavoriteContent); // 메인화면 - 내가 찜한 콘텐츠
}