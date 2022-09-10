import React, { useState } from "react";
import noteContext from "./NotContext";

const NoteState = (props) =>{
  const host = "http://localhost:5000"
    const notesInitials = []

      const [notes,setNotes] = useState(notesInitials)

      /////////////// Add A NOte  /////////////
      const addnote = async(title,description,tag) =>{
        // API Call
        const response = await fetch(`${host}/api/notes/addnote`,{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
          body : JSON.stringify({title,description,tag})
        })
        const json = await response.json();

        // Logic to add in client
        let note = {
          "_id": "63077d9191ef6182012dfa4",
          "user": "6304b8817d32f420b1bfceb6",
          "title": title,
          "description":description,
          "tag": tag,
          "date": "2022-08-25T13:48:01.269Z",
          "__v": 0
        }
        setNotes(notes.concat(note))
      }

      /////////////// Get All NOte  /////////////
      const getallnotes = async() =>{
        // API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`,{
          method : 'GET',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
        })
        const json = await response.json();
        setNotes(json)

      }

      ///////////// Delete Note  /////////////
      const deletenote = async(id) =>{
        // API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
          method : 'DELETE',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
          // body : JSON.stringify({id})
        })
        const json =  response.json();

        // Logic to delete in client
        const newNotes = notes.filter((note)=>{return note._id !== id})
        setNotes(newNotes)
      }


      /////////////// Edit Note   /////////////
      const editnote = async(id,title,description,tag) =>{
        // API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
          method : 'PUT',
          headers : {
            'Content-Type' : 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
          body : JSON.stringify({title,description,tag})
        })
        const json =  await response.json();
      

        
        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag; 
            break; 
          }
        }  
        setNotes(newNotes);
      }

    return(
        <noteContext.Provider value={{notes,addnote,deletenote,editnote,getallnotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;