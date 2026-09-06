const express=require('express')
const noteRouter=express.Router();
const {createNote, getAllNotes, getById, updateNote, deleteNote,search,aiChat}=require('../controller/noteWorks');
const userMiddleware=require('../middleware/userMiddleware');

noteRouter.post('/create',userMiddleware,createNote);
noteRouter.get('/getAll',userMiddleware,getAllNotes);
noteRouter.get('/getById/:id',userMiddleware,getById);
noteRouter.put('/update/:id',userMiddleware,updateNote);
noteRouter.delete('/delete/:id',userMiddleware,deleteNote);
noteRouter.post('/search', userMiddleware, search);
noteRouter.post('/chat', userMiddleware, aiChat);

module.exports=noteRouter;