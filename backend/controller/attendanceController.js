import { Attendance } from "../models/attendance.js";
import fs from 'fs'
import PDFDocument from "pdfkit"
import { Intern } from "../models/intern.js";
export const getTime = (x) => {
    var date_ob = new Date();
    if (!x) {
        return date_ob.toLocaleDateString()
    } else {
        return date_ob.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

}
export const timeConvert = (x) => {
    var time = new Date("01/01/2000 " + x)
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
export const convertDateFormat = (dateString) => {
    // Split the date string by "-"
    var parts = dateString.split("-");

    // Rearrange the parts to "MM/DD/YYYY" format
    var formattedDate =  parts[1] + "/" + parts[2] + "/"+parts[0];

    return formattedDate;
}
export const index = async (request, response) => {
    const intern_id = request.user._id
    const attendance = await Attendance.find({ intern_id: intern_id }).sort({ createdAt: -1 })
    response.status(200).json(attendance)
}
export const get_all_attendance = async (request, response) => {
    const intern_id = request.user._id
    const attendance = await Attendance.find({ intern_id: intern_id }).sort({ createdAt: -1 })
    response.status(200).json(attendance)
}
export const time_in = async (request, response) => {
    // get all department
    var date_now = getTime(false)
    var time_now = getTime(true)
    const intern_id = request.user._id
    const verify_doc = await Attendance.findOne({ "date": `${date_now}`, "intern_id": intern_id });


    try {
        if (verify_doc) {
            return response.status(409).json({ error: `Unable to process, log already exists.` })
        }
        const newTime = await Attendance.create({ intern_id, time_in: time_now, time_out: "-", date: `${date_now}` })
        response.status(200).json(newTime)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }

}
export const time_out = async (request, response) => {
    var date_now = getTime(false)
    var time_now = getTime(true)
    const intern_id = request.user._id
    const verify_doc = await Attendance.findOne({ "date": `${date_now}`, "intern_id": intern_id });
    if (!verify_doc) {
        return response.status(404).json({ error: "Unable to process, you havent timed in yet" })
    }
    if (verify_doc.time_out !== "-") {
        return response.status(409).json({ error: `You've already been timed out.` })
    }
    const attendance = await Attendance.findOneAndUpdate({ "date": `${date_now}`, "intern_id": intern_id }, {
        time_out: time_now
    })
    if (!attendance) {
        return response.status(400).json({ error: "BAD LINK" })
    }
    response.status(200).json(attendance)

}
export const update_time = async (request, response) => {

    var time_now = "05:00 PM (FORCED TIMEOUT)"
    const { current_id_doc } = request.body
    const verify_doc = await Attendance.findOne({ "_id": `${current_id_doc}` });
    if (!verify_doc) {
        console.log("here")
        return response.status(404).json({ error: "Unable to process, you havent timed in yet" })
    }
    if (verify_doc.time_out !== "-") {
        return response.status(409).json({ error: `You've already been timed out.` })
    }

    const attendance = await Attendance.findOneAndUpdate({ "_id": `${current_id_doc}` }, {
        time_out: time_now
    })

    if (!attendance) {
        return response.status(400).json({ error: "BAD LINK" })
    }
    response.status(200).json(attendance)

}
export const edit_time = async (request, response) => {
    const { current_id_doc, newTimeIn, newTimeOut, newDate } = request.body
    if(!newTimeIn){
        newTimeIn = "-";
    }
    const verify_doc = await Attendance.findOne({ "_id": `${current_id_doc}` });
    if (!verify_doc) {
        return response.status(404).json({ error: "Unable to process, you error finding document" })
    }
    if (!newDate || !newTimeIn || !newTimeOut || !newDate) {
        return response.status(404).json({ error: "Unable to process, missing fields" })
    }
    const attendance = await Attendance.findOneAndUpdate({ "_id": `${current_id_doc}` }, {
        time_in: timeConvert(newTimeIn),
        time_out: timeConvert(newTimeOut),
        date: convertDateFormat(newDate),
        createdAt: `${newDate}T01:24:06.373+00:00`
    })

    if (!attendance) {
        return response.status(400).json({ error: "BAD LINK" })
    }
    response.status(200).json(attendance)

}
export const AttendanceToPDF = async (request, response) => {
    const { id } = request.params;
    const attendances = await Attendance.find({ intern_id: id }).sort({ createdAt: 1 })
    const intern = await Intern.findOne({ _id: id })
    class PDFDocumentWithTables extends PDFDocument {
        constructor(options) {
            super(options);
        }

        table(table, arg0, arg1, arg2) {
            let startX = this.page.margins.left, startY = this.y;
            let options = {};

            if ((typeof arg0 === 'number') && (typeof arg1 === 'number')) {
                startX = arg0;
                startY = arg1;

                if (typeof arg2 === 'object')
                    options = arg2;
            } else if (typeof arg0 === 'object') {
                options = arg0;
            }

            const columnCount = table.headers.length;
            const columnSpacing = options.columnSpacing || 15;
            const rowSpacing = options.rowSpacing || 5;
            const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

            const prepareHeader = options.prepareHeader || (() => { });
            const prepareRow = options.prepareRow || (() => { });
            const computeRowHeight = (row) => {
                let result = 0;

                row.forEach((cell) => {
                    const cellHeight = this.heightOfString(cell, {
                        width: columnWidth,
                        align: 'left'
                    });
                    result = Math.max(result, cellHeight);
                });

                return result + rowSpacing;
            };

            const columnContainerWidth = usableWidth / columnCount;
            const columnWidth = columnContainerWidth - columnSpacing;
            const maxY = this.page.height - this.page.margins.bottom;

            let rowBottomY = 0;

            this.on('pageAdded', () => {
                startY = this.page.margins.top;
                rowBottomY = 0;
            });

            // Allow the user to override style for headers
            prepareHeader();

            // Check to have enough room for header and first rows
            if (startY + 3 * computeRowHeight(table.headers) > maxY)
                this.addPage();

            // Print all headers
            table.headers.forEach((header, i) => {
                this.text(header, startX + i * columnContainerWidth, startY, {
                    width: columnWidth,
                    align: 'left'
                });
            });

            // Refresh the y coordinate of the bottom of the headers row
            rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

            // Separation line between headers and rows
            this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
                .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
                .lineWidth(2)
                .stroke();

            table.rows.forEach((row, i) => {
                const rowHeight = computeRowHeight(row);

                // Switch to next page if we cannot go any further because the space is over.
                // For safety, consider 3 rows margin instead of just one
                if (startY + 3 * rowHeight < maxY)
                    startY = rowBottomY + rowSpacing;
                else
                    this.addPage();

                // Allow the user to override style for rows
                prepareRow(row, i);

                // Print all cells of the current row
                row.forEach((cell, i) => {
                    this.text(cell, startX + i * columnContainerWidth, startY, {
                        width: columnWidth,
                        align: 'left'
                    });
                });

                // Refresh the y coordinate of the bottom of this row
                rowBottomY = Math.max(startY + rowHeight, rowBottomY);

                // Separation line between rows
                this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
                    .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
                    .lineWidth(1)
                    .opacity(0.7)
                    .stroke()
                    .opacity(1); // Reset opacity after drawing the line
            });

            this.x = startX;
            this.moveDown();

            return this;
        }
    }
    const doc = new PDFDocumentWithTables();
    doc.pipe(response);
    doc
        .image("controller/components/sample.png", 450, 25, { width: 100 })
        .fillColor("#000")
        .fontSize(18)
        .text("NOCS Attendance Monitoring E-System (NAMES)", 10, 10)
        .fontSize(11)
        .text(`NAME: ${intern.name}`)
        .text(`COURSE: ${intern.course}`)
        .moveDown();

    const table = {
        headers: ["Date", "Time in", "Time Out", "Hours Served"],
        rows: []
    }
    let total = 0;

    for (const attendance of attendances) {
        let dateIn = new Date("01/01/2000 " + attendance.time_in)
        let dateOut = new Date("01/01/2000 " + attendance.time_out)
        let end_lunchBreak = new Date("01/01/2000 01:00 PM")
        let start_lunchBreak = new Date("01/01/2000 12:00 PM")
        if (attendance.time_out != "-") {
            let result = 0;
            if (dateIn <= start_lunchBreak) {

                result = (((dateOut - end_lunchBreak) - (dateIn - start_lunchBreak)) / (1000 * 60)) / 60;
            } else if (dateIn > start_lunchBreak) {

                result = (((dateOut - end_lunchBreak) - (dateIn - end_lunchBreak)) / (1000 * 60)) / 60;
            }
            total += result;
            table.rows.push([attendance.date, attendance.time_in, attendance.time_out, `${result.toFixed(2)} hrs`])
        }
    }

    table.rows.push(["TOTAL:", `${total.toFixed(2)} hrs`]);
    doc.moveDown().table(table, 10, 125, { width: 590 });
    doc.end()
}
export const delete_time = async (req, res) => {
    const { id } = req.params;
    try {
        let attendance = await Attendance.findOne({ "_id": id })
        if (attendance) {
            await Attendance.deleteOne({ "_id": id })
            res.status(200).json({ message: "record has been deleted." });
        }
    } catch (err) {
        res.status(401).json({ error: err.message })
    }
}
