import React, {Component} from 'react';
import {Link} from "@reach/router";
import AskQuestion from "./AskQuestion";

class Questions extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <ol>
                    {this.props.data.map( q => <li>
                        <Link to={`/question/${q.id}`}>{q.text}</Link></li>)}
                </ol>
                <AskQuestion askQuestion={(text) => this.props.askQuestion(text)}/>
            </>
        )
    }
}

export default Questions;