var Datastore = require('nedb');
var moment = require('moment');
var db = new Datastore({filename: '../services/notes.db', autoload: true});

function Note(title, description,   importance, endDate, finished) {
    this.title = title;
    this.description = description;
    this.importance = importance;
    this.endDate = endDate;
    this.finished = finished == 'on';
    this.createdDate = moment().format('YYYY-MM-DD');
}

function addNote(request) {
    var data = request.body;
    var note = new Note(data.title, data.description, data.importance, data.endDate, data.finished);
    db.insert(note);
    return note;
}

function updateNote(request, callback) {
    var data = request.body;
    var isFinished = data.finished == 'on';

    db.update({_id: request.params.id}, { $set: {title: data.title, description: data.description, importance: data.importance,
            endDate: data.endDate, finished: isFinished}}, {multi: false},
        function (err) {
            if(err) {
                console.error(err.message);
                return;
            }

            callback();
        })
}

function removeNote(id, callback) {
    db.remove({_id: id}, {multi: false}, function (err) {
        if(err) {
            console.error(err.message);
            return;
        }

        callback();
    })
}

function getNote(request, response, callback) {
    db.findOne({_id: request.params.id}, function (err, result) {
        if(err) {
            console.error(err.message);
            return;
        }

        callback(response, result);
    });
}

function getAllNotes(callback, response, orderBy, showFinished) {
    var order = 1;

    if(orderBy["importance"]) {
        if(orderBy["reverseOrderImportance"]) {
            order = -1;
        }
        db.find({}).sort({importance: order*-1}).exec(function (err, result) {
            returnResult(err, result, callback, response);
        });
    } else if(orderBy["endDate"]) {
        if(orderBy["reverseOrderEndDate"]) {
            order = -1;
        }
        db.find({}).sort({endDate: order}).exec(function (err, result) {
            returnResult(err, result, callback, response);
        });
    } else if(orderBy["createdDate"]) {
        if(orderBy["reverseOrderCreatedDate"]) {
            order = -1;
        }
        db.find({}).sort({createdDate: order}).exec(function (err, result) {
            returnResult(err, result, callback, response);
        });
    } else if(!showFinished) {
        db.find({finished: false}, function (err, result) {
            returnResult(err, result, callback, response);
        });
    } else {
        db.find({}, function (err, result) {
            returnResult(err, result, callback, response);
        });
    }
}

module.exports = {add : addNote, update: updateNote, remove : removeNote, get : getNote, all : getAllNotes};


function returnResult(err, result, callback, response) {
    if (err) {
        console.error(err.message);
        return;
    }
    callback(response, result);
}