import React from 'react';

export default class LinkInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            submitted: false,
            feedback: "",
            userLink: "",
            shortLink: "",
            longLink: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewLink = this.handleNewLink.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.createShortLink = this.createShortLink.bind(this);
    }

    resetInput(){
        this.setState({userLink: ""});
    }
    
    handleSubmit() {
        this.setState({ submitted: true });
        this.resetInput();
        this.createShortLink(this.state.userLink);
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
                        return this.setState({ shortLink: res.error });
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
                <div className="link-input">
                    { this.state.submitted ? 
                        <div className="link-copy__wrapper">
                            <input className="link-input" type="text" value={this.state.shortLink} onChange={this.handleNewLink}/>
                            <a className="link-input-btn__wrapper" onClick={this.handleCopy}>
                                <p className="link-input-copy">Copy</p>
                            </a>
                        </div>
                        :
                        <div className="link-create__wrapper">
                            <input required className="link-input" id="link-input" type="text" placeholder="Clunky link goes here!" value={this.state.userLink} onChange={(e) => {console.log(e.target.value); this.setState({userLink: e.target.value});}}/>
                            <a className="link-input-btn__wrapper" onClick={this.handleSubmit}>
                                <p className="link-input-send">Shorten</p>
                            </a>
                        </div>
                    }
                </div>
                <h3 className="link-input-feedback">{this.state.feedback}</h3>
            </div>
        );
    }
}