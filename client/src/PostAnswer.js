import React, {Component} from 'react';

class PostAnswer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: ""
        }
    }

    onChange(event) {
        this.setState({
            input: event.target.value
        })
    }

    onClick(event) {
        this.props.postAnswer(this.state.input);
    }

    render() {
        return (
            <React.Fragment>
                <h3>Post answer</h3>
                <input onChange={(event) => this.onChange(event)}
                       type="text" placeholder="Type answer here!"></input>
                <button onClick={() => this.onClick()}>Answer!</button>
            </React.Fragment>
        )
    }
}

export default PostAnswer;

