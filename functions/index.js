const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);
const app = express();

// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
  try {
    let querySnapshot = await itemsRef.get();
    let numRecords = querySnapshot.docs.length;
    let item = {
      id: numRecords + 1,
      title: req.body.title,
      description: req.body.description,
    };
    itemsRef.doc(item.id.toString()).set(item);
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try{
    let querySnapshot = await itemsRef.get();
    res.send(querySnapshot.docs.map(doc => doc.data()));
  }catch(err){
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  let id = req.params.id.toString();
  var picToDelete = itemsRef.doc(id);
  try{
    var pic = await picToDelete.get();
    if (!pic.exists) {
      res.status(404).send("Sorry, that item doesn't exist");
      return;
    }
    else {
      picToDelete.delete();
      res.sendStatus(200);
    }
  }catch (error) {
    res.sentStatus(500).send("Error deleting item: " + id);
  }
});


app.put('/api/items/:id', async (req, res) => {
  let id = req.params.id.toString();
  var picToEdit = itemsRef.doc(id);
  try{
    var pic = await picToEdit.get();
    let item = {
      id: picToEdit.id,
      title: req.body.title,
      description: req.body.description,
    };
    if (!pic.exists) {
      res.status(404).send("Sorry, that item doesn't exist");
      return;
    }
    else {
      itemsRef.doc(item.id.toString()).set(item);
      res.send(item);
    }
  }catch (error) {
    res.sendStatus(500).send("Error editing item: " + id);
  }
});

exports.app = functions.https.onRequest(app);