var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harrisgood$oy';

const fetchuser =(req, res, next)=>
{

    //get the user from jwt token and add it to req object
    const token=req.header('auth-token');
if(!token){
    res.status(401).send({error: "pleaes authinticate by using avalid token"})
}

try {
    const data=jwt.verify(token, JWT_SECRET);
req.user= data.user;
next()
    
} catch (error) {
    res.status(401).send({error: "pleaes authinticate by using avalid token"})
    
}

}

module.exports=fetchuser;