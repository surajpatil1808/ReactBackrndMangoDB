
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//route: get all the notes : GET "/api/notes/getuser"  login required

router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try{
    const  notes= await Note.find({user: req.user.id});

    res.json(notes)
    }
    catch{
        console.error(error.message);
        res.status(500).send("internal server error");

    }
})


//route2: add a new note using post : POST "/api/notes/addnote"  login required

router.post('/addnote', fetchuser,[
    body('title','Enter a valid title').isLength({ min: 3 }),
   body('description', 'desc atleast 5 character').isLength({ min: 5 }),

], async (req, res)=>{
    try{
    const {title, description, tag, }=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const note=new Note({
        title, description, tag, user: req.user.id

    })
    const savedNote= await note.save()

    res.json(savedNote)
}
catch{
    console.error(error.message);
    res.status(500).send("internal server error");

}
})

//route 3: update existing note : POST "/api/notes/updatenote"  login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    const {title, description, tag}= req.body;

    try {
        
    

    //crete a newNote object
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    //Find the note to beupdated and update
    let note= await Note.findById(req.params.id);
    if(!note){
        return res.status.send(404).send("Note Found")
    }

    if(note.user.toString() !== req.user.id)
    {
        return res.status(401).send("Not Allowed");
    }

    note= await Note.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true})
    res.json({note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");

        
}

})

//route 4: Delete Note : DELETE "/api/notes/deletenote"  login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    const {title, description, tag}= req.body;

    try {
        
   
    //Find the note to be delete and delete it
    let note= await Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Note Found")
    }

    //allow deletion only if user owns this  note
    if(note.user.toString() !== req.user.id)
    {
        return res.status(401).send("Not Allowed");
    }

    note= await Note.findByIdAndDelete(req.params.id)
    res.json({"success":"note deleted", note: note });
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
}

})


module.exports = router