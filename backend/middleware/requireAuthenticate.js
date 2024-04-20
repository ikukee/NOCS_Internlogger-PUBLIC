import jwt from 'jsonwebtoken'
import {Intern} from '../models/intern.js'
export const requireAuthenticate = async (request,response,next) => {   
    const {authorization} = request.headers;
    if(!authorization){ // this just checks if the client has a token
        return response.status(401).json({error: 'Authorization token required'})
    }
    const token = authorization.split(' ')[1]  // client passes a json { bearer [token]
    try{
        const {_id} = jwt.verify(token, process.env) 
        request.user = await Intern.findOne({_id}).select('_id')
        next()
    }catch(error){
        response.status(401).json({error:'Request is not authorized'})
    }
    
}
export const ADMAuthenticate = async (request,response,next) => {   
    const {authorization} = request.headers;
    if(!authorization){ // this just checks if the client has a token
        return response.status(401).json({error: 'Authorization token required'})
    }
    const token = authorization.split(' ')[1]  // client passes a json { bearer [token]
    try{
        const {_id} = jwt.verify(token, process.env) 
        request.user = await Intern.findOne({_id}).select('_id')
        next()
    }catch(error){
        response.status(401).json({error:'Request is not authorized'})
    }
    
}
