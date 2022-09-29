import bcrypt from 'bcrypt';

export const isValidPassword = (userPassword, password) => {
    return bcrypt.compareSync(userPassword,password)

}


export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
