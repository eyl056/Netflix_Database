module.exports = function(app) {
    const user = require('../controllers/userController');
    
    app.route('/app/signUp').post(user.signUp);
    app.route('/app/signIn').post(user.signIn);

    //app.get('/app/signUp', user.signUp);
}