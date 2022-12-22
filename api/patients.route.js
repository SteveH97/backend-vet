import express from "express"
import PatientsCtrl from './patients.controller.js';

const router = express.Router();


router.route("/").get(PatientsCtrl.apiGetPatients);

router.post('',PatientsCtrl.apiPostPatient);

router.route("/").put(PatientsCtrl.apiUpdatePatient);

router.route("/").delete(PatientsCtrl.apiDeletePatient);


export default router

