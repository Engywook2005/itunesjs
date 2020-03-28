/**
 * Logs output to console.
 */
class Logger {
    /**
     * Prints a message to the log.
     * @param {*} message - message to be displayed in the logs.
     */
    static logMessage (message) {
        console.log(message);
    }

    /**
   * Reports error.
   * @param {Error} err
   */
    static logError (err) {
        console.error(err);
    }
}

module.exports.Logger = Logger;
