const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CompensationLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    submissionDate : Date,
    requestedDate : Date,
    absenceDate : Date,
});

module.exporst =mongoose.model('Compensation_Leave_Request',CompensationLeaveRequestSchema);