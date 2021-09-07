import React from 'react';

//asset imports
import SendIcon from '../../assets/imgs/send.svg';
import CopyIcon from '../../assets/imgs/copy.svg';

export default class LinkInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            submitted: false,
            feedback: "",
            shortLink: "test"
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewLink = this.handleNewLink.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
    }

    handleSubmit() {
        this.setState({ submitted: true });
    }

    handleNewLink() {
        this.setState({ submitted: false });
        this.setState({ feedback: ""})
    }

    handleCopy() {
        navigator.clipboard.writeText(this.state.shortLink);
        this.setState({ feedback: "link copied"},console.log(this.state.feedback));
    }

    render(){
        return(
            <div className="link-input__wrapper">
                { this.state.submitted ? 
                    <div className="link-copy__wrapper">
                        <input className="link-input" type="text"/>
                        <a className="link-input-btn__wrapper" onClick={this.handleCopy}>
                            <img
                                className="link-input-copy"
                                src={CopyIcon}
                            />
                        </a>
                        
                    </div>
                    :
                    <div className="link-create__wrapper">
                        <input className="link-input" type="text"/>
                        <a className="link-input-btn__wrapper" onClick={this.handleSubmit}>
                            <img
                                className="link-input-send"
                                src={SendIcon}
                            />
                        </a>
                    </div>
                    
                }
                <h3 className="link-input-new" onClick={this.handleNewLink}>new link</h3>
                <h3 className="link-input-feedback">{this.state.feedback}</h3>
            </div>
        );
    }
}