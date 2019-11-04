import React, {Component} from 'react';
import { Router } from "@reach/router";

import Questions from "./Questions";
import Question from "./Question";

class App extends Component {

    constructor(props) {
        super(props);

        this.url = 'http://localhost:8080/api/questions';
        // This is my state data initialized
        this.state = {
            data: [] // Default state is empty, fetched questions from api will be stored here
        }
    }

    // This method is automatically invoked when this component is first rendered (mounted).
    componentDidMount() {
        this.getData();
    }

    getQuestion(id) {
        return this.state.data.find(q => q.id === Number(id));
    }

    voteAnswer(question, answer, status) {
        // create request body for new vote, that will be sent to API
        const vote = {
            status : status
        };

        // sent request body to API
        fetch(`${this.url}/${question.id}/answers/${answer.id}`, {
            method: 'PUT',
            body: JSON.stringify(vote),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new answer:");
                console.log(json);
                this.getData();
            });
    }

    postAnswer(question, text) {
        // create request body for new answer, that will be sent to API
        const answer = {
            text: text
        };

        // sent request body to API
        fetch(`${this.url}/${question.id}/answers`, {
            method: 'POST',
            body: JSON.stringify(answer),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new answer:");
                console.log(json);
                this.getData();
            });
    }

    askQuestion(text) {
        // create request body for new question, that will be sent to API
        const question = {
            text: text
        };

        // sent request body to API
        fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new question:");
                console.log(json);
                this.getData();
            });
    }

    // Fetching data from the API and putting it in the state
    getData() {
        fetch(this.url)
            .then(result => result.json()) // Convert to JSON
            .then(result => { // Put it in the state
                this.setState({
                    data: result
                })
            })
            .catch((error) => { // Catch any errors and write them to the browser console
                console.error(error);
            });
    }

    render() {
        return (
            <React.Fragment>
                <h1>QA Website</h1>
                <Router>
                    <Questions path="/" data={this.state.data}
                               askQuestion={(text) => this.askQuestion(text)}>
                    </Questions>
                    <Question path="/question/:id"
                              postAnswer={(question, text) => this.postAnswer(question, text)}
                              postVoted={(question, answer, status) => this.voteAnswer(question, answer, status)}
                              getQuestion={(id) => this.getQuestion(id)}></Question>
                </Router>
            </React.Fragment>
        )
    }
}

export default App;

