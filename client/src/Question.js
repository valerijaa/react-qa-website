import React, {Component} from 'react';
import PostAnswer from "./PostAnswer";
import VoteAnswer from "./VoteAnswer";
import {Link} from "@reach/router";

class Question extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const id = this.props.id;
        const question = this.props.getQuestion(id);

        return (
            <React.Fragment>
                <h3>Question!</h3>
                <p>{question.text}</p>

                <ul>
                    {
                        question.answers.map( ans =>
                            <li>{ans.text} - ({ans.votes}) <VoteAnswer postVoted={(status) => this.props.postVoted(question, ans, status)} /> </li>
                        )
                    }

                    {question.answers.length > 0 ? "" : <p>No answers..</p>}
                </ul>

                <PostAnswer postAnswer={(text) => this.props.postAnswer(question, text)}/>
            </React.Fragment>
        )
    }
}

export default Question;

