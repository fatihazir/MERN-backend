//Middleware
// @desc Logs request to console
const Logger = (req, res, next) => {
    // req.hello = 'world'
    // console.log("middleware ran")
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next()
}

module.exports = Logger