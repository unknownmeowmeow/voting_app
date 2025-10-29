class ValidationHelper{
    /**
     * Validates poll data including the question and options.
     * Checks for required fields, minimum/maximum lengths, and empty options.
     * @param {Object} poll_data - The poll data to validate.
     * @param {string} poll_data.question - The poll question text.
     * @param {string[]} poll_data.poll - Array of poll option strings.
     * @returns {string[]} Array of validation error messages. Empty array if no errors.
     * Last Updated At: October 28, 2025
     * @author Keith
     */
    validationPoll(poll_data){

        try{
            const { question, poll } = poll_data;
    
            if(!question || !poll){
                return ["All fields are required."];
            }
            
            const question_validation = question.trim();
            const poll_validation = Array.isArray(poll) ? poll.map(opt => opt.trim()) : [];
    
            if(question_validation.length < 10){
                return ["Question must be at least 10 characters long."];
            }
    
            if(poll_validation.length < 2){
                return ["There must be at least 2 poll options."];
            }
    
            if(poll_validation.length > 4){
                return ["Poll options cannot exceed 4."];
            }
    
            if(poll_validation.some(options => options === "")){
                return ["Poll options cannot be empty."];
            }
    
            return [];
        }
        catch(error){
            return ["Error in poll validation."];
        }
    }    

}

export default new ValidationHelper();