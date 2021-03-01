module.exports = function(app) {
    const user = require('../controllers/userController');
    const jwtMiddleware = require('C:/Users/eunyoung/Documents/GitHub/Netflix_Server/netflixAPI/config/jwtMiddleware');

    
    app.route('/app/signUp').post(user.signUp); // 회원가입
    app.route('/app/signIn').post(user.signIn); // 로그인

    app.get('/app/userInfo/userProfile/:userId', user.userProfileInfo); // 사용자 프로필사진, 닉네임

    app.get('/app/userInfo/:userId', jwtMiddleware, user.userInfo); // 특정 사용자 정보

    app.get('/app/userInfo', user.allUserInfo); // 전체 회원

    app.get('/check', jwtMiddleware, user.check);

    //app.get('/app/signUp', user.signUp);
}