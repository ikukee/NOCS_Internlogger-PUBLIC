
import { Adm } from "../models/adm.js"
import Jwt from "jsonwebtoken";
import { Intern } from "../models/intern.js";
import { Attendance } from "../models/attendance.js";
import { json } from "express";
import { convertDateFormat, getTime, timeConvert } from "./attendanceController.js";


export const intern_list = async (request, response) => {
    try {
        const interns = await Intern.find({}).sort({ createdAt: -1 })

        response.status(200).json(interns)

    } catch (error) {
        response.status(400).json({ error: error.message })
    }
}
export const create_attendance = async (request, response) => {
    const {TimeIn,TimeOut,date} = request.body;// 
    const { id } = request.params; // 
    const date_now = convertDateFormat(date);
    const converted_time = timeConvert(TimeIn);
    if (!TimeOut) {
        TimeOut = "-"
    }
    const intern_id = request.user._id
    const verify_doc = await Attendance.findOne({ "date": `${date_now}`, "intern_id": intern_id });
    try {
        if (verify_doc) {
            return response.status(409).json({ error: `Unable to process, log already exists.` })
        }
        const newTime = await Attendance.create({ intern_id: id, time_in: converted_time, time_out: TimeOut, date: `${convertDateFormat(date)}`, createdAt: `${date}T01:24:06.373+00:00` })
        response.status(200).json(newTime)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
}

export const get_admin_account = async (request, response) => {
    const { id } = request.params;
    try {
        const admin = await Adm.findOne({ "email": id }) || await Adm.findOne({ "id_no": id })
        response.status(200).json(admin)
    } catch (err) {
        response.status(404).json({ error: err.message })
    }
}
export const get_intern_attendances = async (request, response) => {
    const { id } = request.params;
    try {
        const attendance = await Attendance.find({ intern_id: id }).sort({ createdAt: -1 })
        response.status(200).json(attendance)
    } catch (err) {
        response.status(400).json({ error: err.message })
    }
}