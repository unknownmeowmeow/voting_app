import db from "../Configs/database.js";

class User{
    constructor(connection = db){
        this.db = connection;
    }
    
    /**
     * Inserts a new users account into the database.
     * @param {Object} create_users_account - Object containing users data to insert.
     * @returns {Object} response_data - Object containing status, result with inserted users ID, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async createUserAccount(create_users_account){
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [insert_user_account] = await db.query(`
                INSERT INTO users SET ?
            `, [create_users_account]);
    
            if(insert_user_account.insertId){
                response_data.status = true;
            } 
            else{
                response_data.error = "Insert users data error";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

    /**
     * Retrieves all users records based on given parameters.
     * @param {string} users_fields - Fields to select.
     * @param {string|number} users_where_clause - WHERE clause condition.
     * @param {Array} users_values - Values to bind in the WHERE clause.
     * @returns {Object} response_data - Object containing status, result array, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async getUserRecords( user_fields, user_where_clause, user_values){
        const response_data =  { status: false, result: null, error: null };
        
        try{
            const [get_all_users] = await this.db.execute(`
                SELECT ${user_fields}
                FROM users
                WHERE ${user_where_clause}
            `, user_values);
    
            if(get_all_users.length){
                response_data.status = true;
                response_data.result = get_all_users;
            }
            else{
                response_data.error =  `User Not Found.`;
            }
        }
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
}

export default new User();
