/**
 * Retrieves the currently logged-in user from the session.
 * @param {Object} req - Express request object containing session data.
 * @returns {Object} user - The user object stored in session.
 * @throws Will throw an error if the session or user data is not found.
 * Last Updated At: October 22, 2025
 * @author Keith
 */
export function getUserFromSession(req){
    if(!req || !req.session || !req.session.user){
        throw new Error("User session not found");
    }

    return req.session.user;
}
