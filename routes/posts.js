const router = require("express").Router()
const User = require('../models/User')
const Post = require('../models/Post')

//CREATE POST
router.post('/', async (req,res)=>{
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE POST
router.put('/:id', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.username === req.body.username){
            try {
                const updatedpost = await Post.findByIdAndUpdate(req.params.id, {
                    $set:req.body
                },{new:true})
                res.status(200).json(updatedpost)
            } catch (error) {
                res.status(500).json(error)
            }
        }
        else{
            res.status(401).json("You can update only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
})

//DELETE POST
router.delete('/:id', async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json("Post not found");
        }
        if(post.username === req.body.username){
            
            try { 
                await Post.findByIdAndDelete(req.params.id)
                res.status(200).json("post has been deleted")
            } catch (error) {
                res.status(500).json({ message: "An error occurred while deleting the post", error })
            }
        }
        else{
            res.status(401).json("You can delete only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
})

//GET POST
router.get("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL POSTS
router.get("/", async (req,res)=>{
    const username = req.query.user
    const cat = req.query.cat
    try {
        let posts
        if(username){
            posts = await Post.find({username})
        }
        else if(cat){
            posts = await Post.find({categories:{
                $in:[cat],
            },})
        }
        else{
            posts = await Post.find() // all the posts.
        }
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router