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
            shortLink: '',
            longLink: "",
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewLink = this.handleNewLink.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.createShortLink = this.createShortLink.bind(this);
    }
    
    handleSubmit(e) {
        const userLink = e.target.parentElement.previousSibling.value;
        this.setState({ submitted: true });
        this.createShortLink(userLink);
    }

    handleNewLink() {
        this.setState({ submitted: false, shortLink: "", feedback: "" });
    }

    handleCopy() {
        navigator.clipboard.writeText(this.state.shortLink);
        this.setState({ feedback: "link copied"});
    }
    
    createShortLink(userLink) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ userLink })
        };

        fetch('http://localhost:8080/create-link', requestOptions)
            .then(res => res.json())
            .then(res => {   
                    if(res.error){
                        return this.setState({ error: res.error });
                    }
                    return this.setState({ shortLink: res.result, feedback: res.feedback })
                })
            .catch(error => {
                console.log(error);
            });
    }

    render(){
        return(
            <div className="link-input__wrapper">
                { this.state.submitted ? 
                    <div className="link-copy__wrapper">
                        {this.state.error && <p className='link-input__error'>{this.state.error}</p>}
                        <input className="link-input" type="text" value={this.state.shortLink}/>
                        <a className="link-input-btn__wrapper" onClick={this.handleCopy}>
                            <img
                                className="link-input-copy"
                                src={CopyIcon}
                            />
                        </a>
                    </div>
                    :
                    <div className="link-create__wrapper">
                        <input className="link-input" id="link-input" type="text" placeholder="enter url"/>
                        <a className="link-input-btn__wrapper" onClick={this.handleSubmit}>
                            <img
                                className="link-input-send"
                                src={SendIcon}
                            />
                        </a>
                    </div>
                }
                { this.state.submitted && 
                    <h3 className="link-input-new" onClick={this.handleNewLink}>new link</h3>
                }
                <h3 className="link-input-feedback">{this.state.feedback}</h3>
            </div>
        );
    }
}