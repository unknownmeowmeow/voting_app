
import database from "../Configs/database.js";
import pollValidation from "../Helpers/poll_validation.js";
import pollOption from "../Models/user_option.js";
import pollQuestion from "../Models/user_question.js";
import pollVotes from "../Models/user_vote.js";
import { 
    getUserFromSession 
} from "../Helpers/validation_session.js";

class UserPoll{
    constructor(){
        this.pollValidation = pollValidation;
        this.db = database;
        this.pollOption = pollOption;
        this.pollQuestion = pollQuestion;
        this.pollVotes = pollVotes;
    }

     /**
     * Create a new poll with associated question and options.
     * @param {Object} req - Express request object containing poll and question details in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of poll creation.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async createPollQuestions(req, res) {
        const connection = await this.db.getConnection();
      
        try{
            const user = getUserFromSession(req); 
            await connection.beginTransaction();
            
            const validation_error = this.pollValidation.pollValidation(req.body);

            /* validate the question and poll */
            if(validation_error.length){
              throw new Error(validation_error.join(", "));
            }

            if(!user){
                throw new Error("user not found");
            }

            const { question, poll } = req.body;

            const get_all_questions = await this.pollQuestion.getAllQuestions(
                `*`,
                `user_questions.name = ?`,
                `user_questions.id DESC`,
                [question]
              );
              
    
            if(get_all_questions.status){
                throw new Error("Question Duplicated");
            }
            
            const get_poll_questions = await this.pollQuestion.insertPollQuestion({ user_id: user.user_id, name: question.trim() },connection);
        
            if(!get_poll_questions.status){
              throw new Error(get_poll_questions.error);
            }

            /* get the result of the inserted question */
            const poll_id = get_poll_questions.result.id;
            
            /* map the poll options as prepared data*/
            const poll_option_data = poll.map(() => "(?, ?)").join(", ");
            const poll_option_values = poll.flatMap(option => [poll_id, option.trim()]);
    
            const poll_option_result = await this.pollOption.insertPollOptions(poll_option_data, poll_option_values, connection);
           
            if(!poll_option_result.status){
              throw new Error(poll_option_result.error);
            }
        
            await connection.commit();
            return res.json({ status: true, message: "Create poll successfully" });
        } 
        catch(error){
            await connection.rollback();
            return res.json({ status: false, message: error.message });
        } 
        finally{
            connection.release();
        }
    }
      
    /**
     * Get all recent polls sorted by creation date descending.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with list of recent polls.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async getNewPolls(req, res){
        try{
            const get_new_polls = await this.pollQuestion.getAllQuestions(
                `user_questions.id AS question_id, 
                 user_questions.name AS question, 
                 user_options.id AS poll_id, 
                 user_options.name AS poll_name, 
                 user_questions.created_at`,
                `user_questions.id IS NOT NULL`,
                `user_questions.created_at DESC`,
                []
            );
    
            if(!get_new_polls.status){
                throw new Error(get_new_polls.error);
            }

            return res.json({ status: true, result: get_new_polls.result });
        } 
        catch (error) {
            return res.json({ status: false, message: error.message });
        }
    }
    
    /**
     * Get top polls based on vote counts, limited to 3.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with list of top polls.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async getTopPolls(req, res){
        try{
            const get_top_polls = await this.pollQuestion.getAllQuestions(
                `user_questions.id AS question_id,
                 user_questions.name AS question_name,
                 user_options.id AS poll_id,
                 user_options.name AS poll_name,
                 COUNT(user_votes.id) AS votes,
                 user_questions.created_at`,
                `user_questions.id IS NOT NULL`,
                `votes DESC`,
                []
            );
    
            if(!get_top_polls.status){
                throw new Error(get_top_polls.error);
            }
    
            return res.json({ status: true, result: get_top_polls.result });
        } 
        catch(error){
            return res.json({ status: false, message: error.message });
        }
    }
    
    
    /**
     * Get all poll options for a specific question ID.
     * @param {Object} req - Express request object containing question ID in req.params.id.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with poll question and options.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async getPollId(req, res){
        
        try{
            const question_id = req.params.id;
            const get_poll_question = await this.pollQuestion.getAllQuestions(
                `user_questions.id, user_questions.name, user_options.id AS poll_id, user_options.name AS poll_name`,
                `user_questions.id = ?`,
                `user_options.id`,
                [question_id]
            );
    
            if(!get_poll_question.status){
                throw new Error(get_poll_question.error);
            }
    
            return res.json({ status: true, result: get_poll_question.result });
        } 
        catch(error){
            return res.json({ status: false, message: error.message });
        }
    }

    /**
     * Submit a vote for a specific poll and question.
     * @param {Object} req - Express request object containing poll_id and question_id in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of vote submission.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async userPollVotes(req, res){
        try{
            const user = getUserFromSession(req);
            const { poll_id, question_id } = req.body;
    
            if(!poll_id || !question_id){
               throw new Error("Missing id's");
            }

            const vote_data = { 
                user_id: user.user_id,  
                poll_id, 
                question_id 
            };
    
            const user_vote_result = await this.pollVotes.insertUserVote(vote_data);
    
            if(!user_vote_result.status){
                throw new Error(user_vote_result.error);
            }
    
            return res.json({ status: true, message: "Vote submitted successfully" });
    
        } 
        catch(error){
            return res.json({ status: false, message: error.message });
        }
    }
    
    /**
     * Get poll results for a specific question ID.
     * @param {Object} req - Express request object containing question ID in req.params.id.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response with poll results including vote counts.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    async getPollResult(req, res){
        const question_id = req.params.id; 
       
        try{
            const poll_results = await this.pollQuestion.getAllQuestions(
                `user_questions.id AS question_id, 
                 user_questions.name AS question, 
                 user_options.id AS poll_id, 
                 user_options.name AS poll_name, 
                 user_questions.created_at,
                 COALESCE(user_votes.id, 0) AS votes`,
                `user_questions.id = ?`,
                `user_questions.created_at DESC`,
                [question_id]
            );
    
            if(!poll_results.status){
                throw new Error(poll_results.error);
            }
    
            return res.json({ status: true, result: poll_results.result });
        } 
        catch (error) {
            return res.json({ status: false, message: error.message });
        }
    }
    
}

export default new UserPoll();
