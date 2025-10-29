class ValidationHelper{
    /**
     * Validates User registration data.
     * @param {Object} user_data - User registration input data.
     * @returns {Array<string>} errors - Array of error messages, empty if validation passes.
     * Last Updated At: October 22, 2025
     * @author Keith
     */
    validateUserRegistration(user_data){

        try{
            const { first_name, last_name, email, password, confirm_password } = user_data;

            if(!first_name || !last_name || !email || !password || !confirm_password){
                return ["All fields are required."];
            }
            
            const first_name_validation = first_name.trim();
            const last_name_validation = last_name.trim();
            const email_validation = email.trim().toLowerCase();
            const password_validation = password.trim();
            const confirm_password_validation = confirm_password.trim();

            if(!/^[a-zA-Z\s]+$/.test(first_name_validation)){
                return ["First name must contain only letters and spaces."];
            }

            if(first_name_validation.length < 3){
                return ["First name must be at least 3 letters."];
            }

            if(!/^[a-zA-Z\s]+$/.test(last_name_validation)) {
                return ["Last name must contain only letters and spaces."];
            }

            if(last_name_validation.length < 3){
                return ["Last name must be at least 3 letters."];
            }

            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_validation)){
                return ["Please enter a valid email address."];
            }

            if(password_validation.length < 8){
                return ["Password must be at least 8 characters."];
            }

            if(password_validation !== confirm_password_validation){
                return ["Password and confirm password do not match."];
            }

            return [];
        }
        catch(error){
            return ["Error in validation registrations."];
        }
    }

    /**
    * Validates User login data.
    * @param {Object} user_data - User login input data.
    * @param {string} user_data.email - User email address.
    * @param {string} user_data.password - User password.
    * @returns {Array<string>} errors - Array of error messages, empty if validation passes.
    * Last Updated At: October 22, 2025
    * @author Keith
    */
    validateUserLogin(user_data){

        try{
            const { email, password } = user_data;

            if(!email || !password){
                return ["All fields are required."];
            }
            else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                return ["Please enter a valid email address."];
            }

            return [];
        }
        catch(error){
            return ["Error in validation login."];
        }
    }

}

export default new ValidationHelper();