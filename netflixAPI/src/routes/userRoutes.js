module.exports = function(app) {
    const user = require('../controllers/userController');
    
    app.route('/app/signUp').post(user.signUp);

    //app.get('/app/signUp', user.signUp);
}