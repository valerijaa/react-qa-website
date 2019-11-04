/**** External libraries ****/
const express = require('express'); // The express.js library for writing the API
const bodyParser = require('body-parser'); // Parse all JSON in incoming requests automatically
const morgan = require('morgan'); // Log out all http requests to the console
const cors = require('cors');

/**** Configuration ****/
const appName = "Express API";
const port = (process.env.PORT || 8080); // Pick either port 8080 or the port in the PORT env variable.
const app = express(); // Get the express app.

app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all http requests to the console
app.use(cors()); // Enable Cross Origin Resource Sharing across all routes. Basically open up your API to everyone.

/**** MongoDB Connection Configuration ****/
const mongoose = require('mongoose'); // We need the mongoose library
// Connection to local database named 'test'. If 'test' doesn't exists, it will automatically be created.
mongoose.connect('mongodb://localhost/qa', {useNewUrlParser: true, useUnifiedTopology: true})
    .then((connection) => { // When the Promise resolves, we do some stuff.
        console.log("Database connected");
        configureMongoDbSchemas();
    })
    .catch(e => { // If any errors happens during connection, we print them here.
        console.error(e)
    });

let questionModel = null;
async function configureMongoDbSchemas() {
    // This is the schema for kitten
    const questionSchema = new mongoose.Schema({
        id: Number,
        text: String,
        answers: [
            {
                id : Number,
                text: String,
                votes: Number
            }
        ]
    });

    // The model is used to do CRUD stuff with question
    questionModel = mongoose.model('question', questionSchema);
}

/**** Routes ****/

// Return all questions in data
app.get('/api/questions', function(req, res) {
    questionModel.find({}).then(
        (questions) => {
            console.log("Found a questions", questions);
            res.json(questions);
        }
    );
});

// Return the question in data with its id equal to ':id' in the route below.
app.get('/api/questions/:id', function(req, res) {
    questionModel.findOne({'id': req.params.id}).then(
        (question) => {
            console.log("Found a question", question);
            res.json(question);
        }
    );
});

// create new question
app.post('/api/questions', (req, res) => {
    const text = req.body.text;
    let newQuestion = new questionModel({
        id: Math.floor(Math.random() * 1001),
        text: text,
        answers: []
    });
    newQuestion.save().then(
        (savedQuestion) => {
            console.log("Saved question.", savedQuestion);
            res.json({ msg: "Question added", newQuestion: savedQuestion});
        }
    )
});

// post new answer for question
app.post('/api/questions/:id/answers', (req, res) => {
    const text = req.body.text;
    const newAnswer = {
        id: Math.floor(Math.random() * 1001),
        text: text,
        votes: 0
    };

    questionModel.findOne({'id': req.params.id}).then(
        (question) => {
            console.log("Found a question", question);
            // add answer to question
            question.answers.push(newAnswer);
            // update question in db
            question.save();
            res.json({ msg: "Answer added", newAnswer: newAnswer});
        }
    );
});

// post new vote for answer
app.put('/api/questions/:questionId/answers/:answerId', (req, res) => {
    const status = req.body.status; // either 'UP' or 'DOWN'
    questionModel.findOne({'id': req.params.questionId}).then(
        (question) => {
            console.log("Found a question", question);
            let answer = question.answers.find(e => e.id === Number(req.params.answerId));
            console.log("Found a answer", answer);
            if (status.toUpperCase() === "UP") {
                answer.votes++;
                console.log("up");
            }
            else {
                answer.votes--;
                console.log("down");
            }

            question.save();
            res.json({ msg: "Vote added", updatedAnswer: answer});
        }
    );
});

/**** Start! ****/
app.listen(port, () => console.log(`${appName} API running on port ${port}!`));