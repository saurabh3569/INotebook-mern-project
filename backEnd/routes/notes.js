const express = require("express");
const router = express.Router();
const fetchuser = require("../midlleware/fetchUser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");

////////  fetch all notes /////////
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("intrnal server occured")
    }
  
});

////////  Add New notes /////////
router.post("/addnote",fetchuser,[
    body("title", "title must be atleast 3 characters").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],async (req, res) => {
    try {
        const {title,description,tag} = req.body
        // if any error then send bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title,description,tag,user:req.user.id
    })
    const savednotes = note.save()

    res.json(note);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("intrnal server occured")
    }
    
  }
);


////////  Update notes /////////
router.put("/updatenote/:id",fetchuser,async (req, res) => {
    const {title,description,tag} = req.body
    try {
        // create a new object
    const newNote = {}
    if(title)(newNote.title = title)
    if(description)(newNote.description = description)
    if(tag)(newNote.tag = tag)

    // find the node to be updated and update to be
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("not found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("intrnal server occured")
    }
    

  })


  ////////  Delete notes /////////
router.delete("/deletenote/:id",fetchuser,async (req, res) => {
    try {
        // find the node to be deleted and delete to be
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("not found")}

    // allow deletion only if user own this note 
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"seccess" : "note has been deleted"})

} catch (error) {
    console.error(error.message);
    res.status(500).send("intrnal server occured")
}
})        
    

module.exports = router;
