import express from 'express';
import { addBlog, deleteBlog, getAllBlogs, getBlogById, getBlogsByUserId, updateBlog } from '../controller/blog-controller.js';

const router = express.Router();

router.get("/",getAllBlogs)
router.post("/add",addBlog)
router.put("/update/:blogId",updateBlog);
router.get("/:blogId",getBlogById);
router.delete("/:blogId",deleteBlog);
router.get("/user/:userId",getBlogsByUserId);


export default router;