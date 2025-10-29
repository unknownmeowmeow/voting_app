import db from "../Configs/database.js";

class pollModel{
    constructor(connection = db){
        this.db = connection;
    }

    /**
     * Inserts multiple poll options for a specific question.
     * @param {Array} option_data - Array of objects containing question_id and option name.
     * @param {Object} connection - Database connection (default: this.db).
     * @returns {Object} response_data - Object containing status, result with affected rows, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async insertPollOptions(option_data, connection = this.db){
        const response_data = { status: false, result: null, error: null };
    
        try{
            const option_data_map = option_data.map(() => "(?, ?)").join(", ");
            const options_values = [];
            option_data.forEach(option => options_values.push(option.question_id, option.name));
    
            const [insert_poll_options] = await connection.query(
                `INSERT INTO user_options (question_id, name) VALUES ${option_data_map}`,
                options_values
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

export default new pollModel();
