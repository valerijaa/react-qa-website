import React, {Component} from 'react';

class VoteAnswer extends Component {

    constructor(props) {
        super(props);
    }

    onClick(status) {
        this.props.postVoted(status);
    }


    render() {
        const upVote = "UP";
        const downVote = "DOWN";
        return (
            <React.Fragment>
                <button onClick={() => this.onClick(upVote)}>+</button>
                <button onClick={() => this.onClick(downVote)}>-</button>
            </React.Fragment>
        )
    }
}

export default VoteAnswer;

