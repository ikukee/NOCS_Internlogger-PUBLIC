const admSchema ={
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        id_no: {
            type: String,
            required: true,
            unique: true
        },
    }
admSchema.prototype.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All Fields must be filled")
    }

    const user = await this.findOne({ email }) || await this.findOne({ "id_no": email })

    if (!user) {
        throw Error("Incorrect Login Credentials.")
    }
    if (!match) {
        throw Error("Incorrect Login Credentials.")
    }
    return user
}
admSchema.prototype.update_password = async function (id, new_password, confirm_password, old_password) {
    if (!new_password || !confirm_password || !old_password) {
        throw Error("All fields must be filled")
    }
    const user = await this.findOne({ "_id": id })
    if (!user) {
        throw Error("Incorrect Login Credentials.")
    }
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