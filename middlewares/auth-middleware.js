const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const checkUserAuth = async (req, res, next) => {
    let token;
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1]
           
            //verify Token
            const {userId} = jwt.verify(token,process.env.SECRET_KEY)

            // Get User from Token
            req.user = await userModel.findById(userId).select('-password');
            console.log(req.user);
            next();
        }
        catch(error){
            console.log(error);
            res.status(401).send({'status': 'Failed', 'message': 'Unauthorize Token'})
        }
    }
    if (!token){
        res.status(401).send({'status': 'failed', 'message': "Unauthorized User, No Token"})
    }
}

module.exports = checkUserAuth;
