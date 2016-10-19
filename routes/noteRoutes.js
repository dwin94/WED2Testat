var express = require('express');
var router = express.Router();
var notes = require('../controller/noteController.js');


router.get('/', notes.showIndex);
router.get('/newNote', notes.getNewNote);
router.post('/note', notes.addNewNote);
router.get('/note/:id/', notes.getNode);
router.post('/note/:id', notes.update); //TODO: put
router.delete('/note/:id', notes.removeNote);
router.get('/changeStyle', notes.changeStyle);

module.exports = router;