import User from "../model/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const getAllUsers = async (req,res,next)=>{
    let users;
     try{
        users = await User.find();
     }catch(err){
        console.log(err);
     }
     if(!users){
        return res.status(404).json({message: 'No Users Found'})
     }

     return res.status(200).json({users})

}

const signup = async(req,res,next)=>{
    const {name,email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email})
    }catch(err){
        console.log(err);
    }

    if(existingUser){
        return res.status(400).json({message: "User already exists! Login Instead"});
    }

    const hashedPassword  = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs:[]
    });

    try{
        await user.save();
    }catch(err){
        console.log(err);
    }

    return res.status(201).json({user});
}


const login = async (req,res,next)=>{
    const {email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email})
    }catch(err){
        console.log(err);
    }

    if(!existingUser){
        res.status(400).json({message:"No User Found"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);

    if(!isPasswordCorrect){
        res.status(400).json({message: "Invalid Email / password"});
    }

    const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRETE_KEY,{expiresIn: '1hr'});

    res.cookie(String(existingUser._id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000*3600),
        httpOnly: true,
        sameSite: 'lax'
    })

    return res.status(200).json({message: "Successfully Logged in", existingUser});
}

const verifyToken = (req,res, next)=>{
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    // const headers = req.headers['authorization'];
    // const token = headers.split(" ")[1];
    console.log(token);
    if(!token){
        res.status(404).json({message: 'No token found'});
    }
    jwt.verify(String(token),process.env.JWT_SECRETE_KEY,(err, user)=>{
        if(err){
            return res.status(400).json({message: 'Invalid Token'})
        }
        // console.log(user.id);

        req.userId = user.id;

    })

    next();
}



const getUser = async(req,res,next) =>{
    const userId = req.userId;
    let user;

    try{
        user = await User.findById(userId,"-password")
    }catch(err){
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:'User Not found'});
    }
    return res.status(200).json({user})
}


const refresh = async(req,res,next) =>{
    const {email,password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email})
    }catch(err){
        console.log(err);
    }

    if(!existingUser){
        res.status(400).json({message:"No User Found"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);

    if(!isPasswordCorrect){
        res.status(400).json({message: "Invalid Email / password"});
    }

    const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRETE_KEY,{expiresIn: '1hr'});

    res.cookie(String(existingUser._id),token,{
        path:'/',
        expires: new Date(Date.now() + 1000*3600),
        httpOnly: true,
        sameSite: 'lax'
    })

    return res.status(200).json({message: "Successfully Logged in", existingUser, token});
}


const logout = async(req,res,next) =>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({message: 'Does not found any token'});
    }
   
    jwt.verify(String(prevToken),process.env.JWT_SECRETE_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message: 'Authentication failed'})
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = '';

        return res.status(200).json({message:'Successfully logged out'});    
    })

    
}




export {getAllUsers, signup, login, verifyToken, getUser, logout, refresh};

