import db from "../Configs/database.js";

class UserPollQuestions{
    constructor(connection = db){
        this.db = connection;
    }

    /**
     * Inserts a new question into the database.
     * @param {Object} create_question - Object containing question data to insert.
     * @param {Object} connection - Database connection (default: this.db).
     * @returns {Object} response_data - Object containing status, result with inserted question ID, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async insertPollQuestion(create_question, connection = this.db){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [insert_employee_account] = await connection.query(`
                INSERT INTO user_questions SET ?
            `, [create_question]);
    
            if(insert_employee_account.insertId){
                response_data.status = true;
                response_data.result = { id: insert_employee_account.insertId };
            } 
            else{
                response_data.error = "No poll question were inserted.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
     * Fetch all polls with optional vote counts, filtering, and ordering.
     * @param {string} poll_fields - Comma-separated fields to select.
     * @param {string} poll_where - WHERE clause for filtering records.
     * @param {string} order_by - ORDER BY clause.
     * @param {Array} poll_values - Array of values for prepared statement placeholders.
     * @returns {Object} response_data - Object containing status, result array of polls, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async getAllQuestions(poll_fields, poll_where, order_by, poll_values){
        const response_data = { status: false, result: null, error: null };
    
        try {
            const [get_all_list] = await this.db.query(`
                SELECT ${poll_fields},
                IFNULL(COUNT(user_votes.id), 0) AS votes
                FROM user_questions
                LEFT JOIN user_options ON user_options.question_id = user_questions.id
                LEFT JOIN user_votes ON user_votes.poll_id = user_options.id
                AND user_votes.question_id = user_questions.id
                WHERE ${poll_where}
                GROUP BY user_questions.id, user_options.id
                ORDER BY ${order_by}
            `, poll_values);
    
            if(get_all_list.length){
                response_data.status = true;
                response_data.result = get_all_list;
            } 
            else{
                response_data.error = "Polls Not Found.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
}

export default new UserPollQuestions();