const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    patientName:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: String,
        required: true
    },
    Owner:{
        type: String,
        required: true
    },
    breed:{
        type: String,
        required: true
    },
    reasonForVisit:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    dateRegistered:{
        type: Date,
        required: true
    }
},{
    timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;