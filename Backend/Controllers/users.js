import bcrypt from "bcrypt";
import user from "../Models/user.js"; 
import userValidation from '../Helpers/validation_helper.js';
import database from "../Configs/database.js";

class User{
    constructor(){
        this.user = user;
        this.userValidation = userValidation;
        this.db = database;
    }

    /**
     * Registers a new users in the system, including validation, role and gender verification,
     * password hashing, and initial leave credit assignment if applicable.
     * @param {Object} req - Express request object containing registration details in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of registration.
     * Last Updated At: October 22, 2025
     * @author Keith
     */
    async userRegistrations(req, res){
        try{
            /* Validate users registration input fields */
            const validation_error = this.userValidation.validateUserRegistration(req.body);
    
            if(validation_error.length){
                throw new Error(validation_error.join(", "));
            }
    
            const { first_name, last_name, email, password} = req.body;
    
            /* Check if email already exists */
            const email_exist_record = await this.user.getUserRecords(
                `email`, 
                `email = ?`, 
                [email]
            );
        
            if(email_exist_record.status){
                throw new Error("Email already exist");
            }
    
            /* Hash users password */
            const hash_password = await bcrypt.hash(password, 12);
    
            const create_account = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hash_password
            };
    
            /* Create new users account */
            const create_new_users = await this.user.createUserAccount(create_account);
    
            if(!create_new_users.status){
                throw new Error(create_new_users.error);
            }

            return res.json({ status: true, message: "Registration Successful" });
        }
        catch(error){
            return res.json({ status: false, message: error.message });
        }
    }
    
    /**
     * Handles user login by validating credentials, verifying email existence,
     * comparing passwords, and establishing a user session.
     * @param {Object} req - Express request object containing login credentials.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of login.
     * Last Updated At: October 22, 2025
     * @author Keith
     */
    async userLogin(req, res){
        try{
            const validation_error = this.userValidation.validateUserLogin(req.body);
    
            if(validation_error.length){
                throw new Error(validation_error.join(", "));
            }
    
            const { email, password } = req.body;
    
            const user_records = await this.user.getUserRecords(
                `*`,
                `email = ?`,
                [email]
            );
    
            if(!user_records.status){
                throw new Error(user_records.error);
            }
    
            const user = user_records.result[0]; 
    
            if(!user){
                throw new Error("user not found");
            }
    
            const password_match = await bcrypt.compare(password, user.password);
    
            if(!password_match){
                throw new Error("Password does not match");
            }
    
            req.session.user = { 
                user_id: user.id, 
                first_name: user.first_name, 
                last_name: user.last_name,
                email: user.email
            };
    
            return res.json({ status: true, message: "Login successful", user: req.session.user });
        } 
        catch(error){
            return res.json({ status: false, message: error.message });
        }
    }

    /**
     * Logs out the currently logged-in user by destroying the session.
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of logout.
     * Last Updated At: October 22, 2025
     * @author Keith
     */
    async userLogout(req, res){

        try{
            if(!req.session.user){
              throw new Error("No Session for user Found Failed to Logout")
            }

            req.session.destroy(error => {
                
                if(error){
                    throw new Error("Server Error");
                }
                else{
                    return res.json({ status: true, message: "Successfully Logout" });
                }
            });
        }
        catch(error){
            return res.json({ status: false, message: error.message });
        }

    }
    
}

export default new User();
