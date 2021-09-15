import React from 'react';

//component imports
import Header from './components/header/Header';
import LinkInput from './components/link-input/Link-input';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    }
  }

  render(){
    return (
      <div className="app__wrapper">
        <Header/>
        <div className="body__wrapper">
          <div className="body-text__wrapper">
            <h2 className="body-text-title">Say goodbye to long, clunky links; </h2>
            <p className="body-text">
            Quick, easy and hassle free.
            </p>
            <LinkInput/>
          </div>
          
        </div>
      </div>
    );
  }
}
