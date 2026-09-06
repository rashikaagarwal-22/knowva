const Note=require("../models/note");
const generateEmbeddings= require("../utils/generateEmbeddings")
const keywordSearch= require("../utils/keywordSearch")
const vectorSearch= require("../utils/vectorSearch")
const mergeSearchResults= require("../utils/mergeSearchResults")
const {chat, transformQuery}=require("../utils/chat")

const createNote= async (req,res)=>{
    try{
        const { title, content, plainText, tags } = req.body;

        const myString=`Title: ${title.trim()}
tags: ${tags.join(', ')}
content: ${plainText.trim()}`;
        

        const embedding=await generateEmbeddings(myString);
        const embeddings=(embedding.length>0)?embedding[0].values:[];

        const generatedNote = await Note.create({
            title,
            content,
            plainText,
            embeddings,
            tags,
            creator: req.user._id
        });
        res.status(201).json({
            message: "Note created successfully",
            note: generatedNote
        });
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const getAllNotes=async (req,res)=>{
    try{
        const notes=await Note.find({creator:req.user._id}).select('_id title plainText tags updatedAt');
        // if(notes.length==0)
        //     res.status(404).send("No notes are available");
        res.status(200).send(notes);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const getById=async (req,res)=>{
    try{
        const note= await Note.findById(req.params.id);
        if(!note)
            return res.status(404).send("Invalid NoteID");
        if(!note.creator.equals(req.user._id))
            return res.status(403).send("Unauthorized User");
        return res.status(200).send(note);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const updateNote=async (req,res)=>{
    try{
        const id=req.params.id;
        const note= await Note.findById(id);
        if(!note)
            return res.status(404).send("Invalid NoteID");
        if(!note.creator.equals(req.user._id))
            return res.status(403).send("Unauthorized User");

        const myString=`Title: ${req.body.title.trim()}
tags: ${req.body.tags.join(', ')}
content: ${req.body.plainText.trim()}`;
        

        const embedding=await generateEmbeddings(myString);
        const embeddings=(embedding.length>0)?embedding[0].values:[];

        const newNote= await Note.findByIdAndUpdate(id,{...req.body, embeddings},{runValidators:true,returnDocument: "after"});
        
        res.status(200).send(newNote);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const deleteNote=async (req,res)=>{
    try{
        const id=req.params.id;
        const note= await Note.findById(id);
        if(!note)
            return res.status(404).send("Invalid NoteID");
        if(!note.creator.equals(req.user._id))
            return res.status(403).send("Unauthorized User");
        await Note.findByIdAndDelete(id);
        return res.status(200).send("Note deleted");
    }
    catch(err){
        return res.status(500).send("Error: "+err);
    }
}

const search=async (req,res)=>{
    const query = req.body.query?.trim();

    if (!query) {
        return res.status(400).json({
            message: "Query is required."
        });
    }
    try{
        const [keywordResults, queryEmbedding] = await Promise.all([
            keywordSearch(query,req.user._id),
            generateEmbeddings(query)
        ]);
        const semanticResults = await vectorSearch(queryEmbedding[0].values, req.user._id);

        const finalResults=mergeSearchResults(keywordResults, semanticResults);

        return res.status(200).send(finalResults);


    }
    catch(err){
        return res.status(500).send("Error: "+err);
    }
}

const aiChat= async (req,res)=>{
    const question= req.body.question?.trim();

    if(!question){
        return res.status(400).json({
            message: "Question is required"
        });
    }
    try{
        const enhancedQuestion= await transformQuery(question);
        const questionEmbedding= await generateEmbeddings(question);
        const semanticResults= await vectorSearch(questionEmbedding[0].values, req.user._id);

        const context = semanticResults
            .map(note => `${note.title}\n${note.plainText}`)
            .join("\n\n------------\n\n");

        const response= await chat(enhancedQuestion, context);

        return res.status(200).send(response);
    }
    catch(err){
        return res.status(500).send("Error: "+err);
    }
}
module.exports={createNote, getAllNotes, getById, updateNote, deleteNote, search, aiChat};
