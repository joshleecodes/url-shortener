import React from 'react';

//component imports
import Header from './components/header/Header';
import LinkInput from './components/link-input/Link-input';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      apiResponse: "" 
    }
  }

  callAPI() {
    fetch("http://localhost:8080/testAPI")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res}));
  }
  
  componentDidMount() {
    this.callAPI();
  }

  render(){
    return (
      <div className="app__wrapper">
        <Header/>
        <div className="body__wrapper">
          <div className="body-text__wrapper">
            <h2 className="body-text-title">URL shortener slogan</h2>
            <p className="body-text">
              Enter a url, click go and get a shortened url quickly and easily.
            </p>
          </div>
            <LinkInput/>
            {/* {this.state.apiResponse} */}
        </div>
      </div>
    );
  }
}
