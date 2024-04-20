
const attendanceSchema = {
    intern_id: {
        type: String,
        required: true
    },
    time_in: {
        type: String,
        required: true
    },
    time_out: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}

