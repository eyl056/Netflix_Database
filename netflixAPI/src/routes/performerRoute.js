module.exports = function(app) {
    const performer = require('../controllers/performerController');
    
    app.get('/app/performer/performerInfo/:performerID', performer.performerDetailInfo); // 출연자 정보
}