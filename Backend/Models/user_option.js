import db from "../Configs/database.js";

class UserPollOption{
    constructor(connection = db){
        this.db = connection;
    }

    /**
     * Inserts multiple poll options for a specific question.
     * @param {Array} poll_option_data - Array of objects containing question_id and option name.
     * @param {Array} poll_option_values - Array of objects containing question_id and option name.
     * @param {Object} connection - Database connection (default: this.db).
     * @returns {Object} response_data - Object containing status, result with affected rows, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async insertPollOptions(poll_option_data, poll_option_values, connection = this.db){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const [insert_poll_options] = await connection.query(
                `INSERT INTO user_options (question_id, name) VALUES ${poll_option_data}`,
                poll_option_values
            );
    
            if(insert_poll_options.insertId){
                response_data.status = true;
            } 
            else{
                response_data.error = "No poll options were inserted.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }
    

}

export default new UserPollOption();
