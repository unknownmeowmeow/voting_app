import db from "../Configs/database.js";

class UserPollVotes{
    constructor(connection = db){
        this.db = connection;
    }

    /**
     * Submit a vote for a specific poll and question.
     * @param {Object} vote_data - Object containing user_id, poll_id, and question_id.
     * @returns {Object} response_data - Object containing status, result message, or error.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async insertUserVote(vote_data){
        const response_data = { status: false, result: null, error: null };

        try{
            const [insert_user_votes] = await this.db.query(
                `INSERT INTO user_votes SET ?`,
                [vote_data]
            );

            if(insert_user_votes.insertId){
                response_data.status = true;
            }
            else{
                response_data.error = "Failed to submit vote.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default new UserPollVotes();