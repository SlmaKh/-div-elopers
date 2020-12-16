const staffMemberController = require('../Controllers/staffMemberController.js');
const authorization = require('../Authorization/auth.js'); 
const express = require('express');
const staffMemberRouter = express.Router();

staffMemberRouter.post('/login', staffMemberController.login);
staffMemberRouter.post('/logout', authorization.authStaffMember,staffMemberController.logout);

staffMemberRouter.post('/signIn',authorization.authStaffMember,staffMemberController.signIn);
staffMemberRouter.post('/signOut',authorization.authStaffMember,staffMemberController.signOut);

staffMemberRouter.get('/viewProfile', authorization.authStaffMember,staffMemberController.viewProfile);
staffMemberRouter.post('/resetPassword', authorization.authStaffMember,staffMemberController.resetPassword);
staffMemberRouter.get('/viewAttendance',authorization.authStaffMember,staffMemberController.viewAttendance);

module.exports = staffMemberRouter;