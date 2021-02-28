module.exports = function(app) {
    const user = require('../controllers/userController');
    
    app.route('/app/signUp').post(user.signUp); // 회원가입
    app.route('/app/signIn').post(user.signIn); // 로그인

    //app.get('/app/signUp', user.signUp);
}