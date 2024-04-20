import validator from "validator";

const internSchema ={
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    id_no: {
        type: String,
        required: true,
        unique: true
    },
    contact_no: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    hours_required: {
        type: Number,
    }
}
internSchema.prototype.signup = async function (email, name, password, confirm_password, id_no, contact_no, course, school) {
    if (!email || !password || !name || !id_no || !contact_no || !course || !school) {
        throw Error("All fields must be filled")
    }
    if (!validator.isEmail(email)) {
        throw Error("NOT A VALID EMAIL!")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough")
    }
    if (password != confirm_password) {
        throw Error("Passwords do not match")
    }
    const exists = await this.findOne({ email })
    if (exists) {
        throw Error("Email already in use.")
    }


    return user
}
internSchema.prototype.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All Fields must be filled")
    }

    const user = await this.findOne({ email }) || await this.findOne({ "id_no": email })

    if (!user) {
        throw Error("Incorrect Login Credentials.")
    }
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error("Incorrect Login Credentials.")
    }
    return user
}
internSchema.prototype.update_password = async function (email, new_password, confirm_password, old_password) {

    if (!new_password || !confirm_password || !old_password) {
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error("Incorrect Login Credentials.")
    }
    // const match = await bcrypt.compare(old_password, user.password)
    if (!match) {
        throw Error("Incorrect Credentials")
    }
    if (!validator.isStrongPassword(new_password)) {
        throw Error("Password not strong enough")
    }
    if (checkUnique) {
        throw Error("Do not use your previous password")
    }
    if (new_password != confirm_password) {
        throw Error("Passwords Do Not Match")
    }
    throw Error("Success")
}
internSchema.prototype.reset_pwd = async function (id, password) {
    if (!password) {
        throw Error("All Fields must be filled")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough")
    }

    throw Error("SUCCESS")

}
internSchema.prototype.set_hours_required = async function (id, hours) {
    if (!hours) throw Error("Field should not be empty.");
    if (!id) throw Error("Error, something went wrong, please refresh the page.");

    try {
        const updateThisAccount = await this.findOneAndUpdate({ _id: id }, {
            hours_required: hours
        })
    } catch (error) {
        throw Error("Error. Please try again in a few minutes.");
    }
}