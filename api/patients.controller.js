import PatientsDAO from "../dao/patientsDAO.js";

export default class PatientsController{

    //This will read all patients or find a certain one. Read section of CRUD
    static async apiGetPatients(req, res, next){
        
        const patientsPerPage = req.query.patientsPerPage ? parseInt(req.query.patientsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};

        if(req.query.patientName){
            filters.patientName = req.query.patientName;
        } else if (req.query.dateOfBirth){
            filters.dateOfBirth = req.query.dateOfBirth;
        }

        const { patientsList, totalNumPatients } = await PatientsDAO.getPatients({
            filters,
            page,
            patientsPerPage
        })

        let response = {
            patients: patientsList,
            page: page,
            entries_per_page: patientsPerPage,
            total_results: totalNumPatients
        }

        res.json(response);     
    }


    //This will create a new patient and add it to mongodb. Create section of CRUD
    static async apiPostPatient(req,res,next){

        
        try{
            const patientName = req.body.patientName;                    
            const dateOfBirth = req.body.dateOfBirth;
            const Owner = req.body.Owner;
            const breed = req.body.breed;
            const reasonForVisit = req.body.reasonForVisit;
            const status = req.body.status;
            const dateRegistered = new Date();

            const PatientResponse = await PatientsDAO.addPatient(
                patientName,
                dateOfBirth,
                Owner,
                breed,
                reasonForVisit,
                status,
                dateRegistered
            )

            res.json({status: "It went through broh!"});
        } catch(e){
            res.status(500).json({error: e.message});
        }
    }

    //This will update the status of a patient. Update section of CRUD.
    static async apiUpdatePatient(req, res, next){

        
        console.log("update " + req.body._id);

        try{
            const _id = req.body._id;
            const Owner = req.body.Owner;
            const status = req.body.status;
        


            const patientResponse = await PatientsDAO.updatePatient(
                _id,
                status,
                Owner
            )

            var {error} = patientResponse;
            if(error){
                res.status(400).json({ error });
            }

            if(patientResponse.modifiedCount === 0){
                throw new Error(
                    "Nah man, couldn't update it, user may not be the original poster :P"
                )
            }
            
            res.json({status: "updated the patient!"});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }

    //Delete section of CRUD...pretty self explanatory
    static async apiDeletePatient(req,res,next){
        
        try{
            const _id = req.body.id;
            

            const patientResponse = await PatientsDAO.deletePatient(
                _id
            )

            console.log(patientResponse);
            res.json({status: "patient is gone GONE!!"})
        }catch(e){
            res.status(500).json({error: e.message});
        }
    }


}