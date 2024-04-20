import { Intern } from "../models/intern.js";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

export const get_intern_account = async (request, response) => {
    const { id } = request.params;
    
    try {
        const intern = await Intern.findOne({ "email": id }) || await Intern.findOne({ "id_no": id }) || await Intern.findOne({ "_id": id })
        
        response.status(200).json(intern)
    } catch (err) {
        response.status(404).json({ error: err.message })
    }
}
export const set_hours_required = async (req, res) => {

    const { hours, userID } = req.body;
    try {
        const intern = await Intern.set_hours_required(userID, hours)
        return res.json(intern);
    } catch (err) {
        return res.json(err)
    }
}