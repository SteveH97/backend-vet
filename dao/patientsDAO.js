//This file is the DAO (Data access Object) which has the CRUD methods for the mongo database

//this variable will be the refernce to the database
let patients 

import { ObjectId } from "mongodb";

export default class PatientsDAO{

    //This method gets called as soon as the server starts in order to connect to the database
    static async injectDB(connection){
        //check if patients is filled 
        if(patients){
            return;
        }
        try{
            //access the VET database and then the VetList collection
            patients = await connection.db("Vet").collection("VetList")
        } catch(e){
            console.error(
                `oh uh bruh! Unable to establish a collection handle in patientsDAO: ${e}`
            )
        }
    }

    //Add a patient
    static async addPatient(patientName,dateOfBirth, Owner, breed, reasonForVisit, status, dateRegistered){
        try{
            const patientDoc = {
                patientName: patientName,
                dateOfBirth: dateOfBirth,
                Owner: Owner,
                breed: breed,
                reasonForVisit: reasonForVisit,
                status: status,
                dateRegistered: dateRegistered
            }
            return await patients.insertOne(patientDoc);
        }catch(e){
            console.error(`The post didn't go through bruh! Here's the error: ${e}`);
            return { error: e }
        }
    }



    //Read either the list or find a certain patient
    static async getPatients({
        filters = null,
        page = 0,
        patientsPerPage = 20,
    } = {}){
        let query;
        if (filters){
            if ("patientName" in filters){
                query = {$text: {$search: filters["patientName"]}}
            } else if ("dateOfBirth" in filters){
                query = { "dateOfBirth": {$eq: filters["dateOfBirth "]}}
            }
        }

        let cursor;

        try{
            cursor = await patients
                .find(query)
        } catch(e){
            console.error(`Unable to issue find command, ${e}`);
            return {patientsList: [], totalNumPatients: 0};
        }

        const displayCursor = cursor.limit(patientsPerPage).skip(patientsPerPage * page);

        try{
            const patientsList = await displayCursor.toArray();
            const totalNumPatients = await patients.countDocuments(query);

            return {patientsList, totalNumPatients}
        } catch (e){
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { patientsList: [], totalNumPatients: 0}
        }
    }

    //Update a patient
    static async updatePatient(_id, status, Owner){
        
        try{
            const updatePatient = await patients.updateOne(
                {_id: ObjectId(_id)},
                { $set: {status: status, Owner: Owner}}           
            )

            return updatePatient
        }catch(e){
            console.error(`Can't update it for this reason: ${e}`);
            return { error: e };
        }
    }

    //Delete a patient from database/collection
    static async deletePatient(_id){
        
        try{
            const deletePatient = await patients.deleteOne({
                _id: ObjectId(_id)
            })

            return deletePatient;
        }catch(e){
            console.error(`Nope! Didn't delete cuz of this: ${e}`);
            return { error: e };
        }
    }
}