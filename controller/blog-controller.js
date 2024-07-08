import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";


const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try{
        blogs = await Blog.find().populate('user');
    }catch(err){
        console.log(err);
    }

    if(!blogs){
        return res.status(404).json({message: "No Blogs found"})
    }
    return res.status(200).json({blogs})

}

const addBlog = async(req,res,next)=>{
    const{title,description,image,tag,user} = req.body;
    let existingUser;

    try{
        existingUser = await User.findById(user);
    }catch(err){
        console.log(err);
    }

    if(!existingUser){
        res.status(400).json({message: "Unable to find user by this Id"});
    }

    const blog = new Blog({
        title,
        description,
        image,
        tag,
        user
    })
    try{
        // await blog.save();   
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        return res.status(500).json({message: err})
    }

    return res.status(201).json({blog});
}

const updateBlog = async (req,res,next) =>{
    const{title,description} = req.body;
    const blogId = req.params.blogId;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId,{
            title, description
        });
    }catch(err){
        return res.status(500).json({message: err})
    }

    if(!blog){
        return res.status(500).json({message: "Unable to update the blog"});
    }

    return res.status(200).json({blog})
}

const getBlogById = async(req,res,next) =>{
    const blogId = req.params.blogId;
    let blog;
    try{
        blog = await Blog.findById(blogId)
    }catch(err){
        return res.status(500).json({message: err})
    }

    if(!blog){
        return res.status(400).json({message: "No Blog Found"})
    }

    return res.status(200).json({blog});
}

const deleteBlog = async(req,res,next)=>{
    const blogId = req.params.blogId;
    let blog;
    try{
        blog = await Blog.findByIdAndRemove(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        return res.status(500).json({message: err})
    }

    if(!blog){
        return res.status(500).json({message: "Unable to delete blog"});
    }
    return res.status(200).json({message: "Blog is deleted successfully"});
}

const getBlogsByUserId = async(req,res,next)=>{
    const userId = req.params.userId;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate('blogs')
    }catch(err){
        return res.status(500).json({message: err})
    }

    if(!userBlogs){
        return res.status(404).json({message: 'No Blogs Found'})
    }
    return res.status(200).json({userBlogs});
}



export {getAllBlogs, addBlog, updateBlog, getBlogById, deleteBlog, getBlogsByUserId};
