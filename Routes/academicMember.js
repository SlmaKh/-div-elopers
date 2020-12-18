const academicMemberController = require('../Controllers/academicMemberController.js');
const {authStaffMember, authAcademicMember} = require('../Authorization/auth.js');

const express = require('express');
const academicMemberRouter = express.Router();

auth = [authStaffMember,authAcademicMember];



academicMemberRouter.post('/sendSlotLinkingRequest', auth, academicMemberController.sendSlotLinkingRequest);
academicMemberRouter.post('/sendChangeDayOffRequest', auth, academicMemberController.sendChangeDayOffRequest);
module.exports = academicMemberRouter;