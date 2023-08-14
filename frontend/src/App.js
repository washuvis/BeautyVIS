import React, { Component } from 'react';
import { HashRouter as BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Survey from "./pages/survey";
import ThankYou from "./pages/thank_you";
import Intro from "./pages/introduction";
import Tutorial from "./pages/tutorial";
import VisQuiz from "./pages/visualization_quiz";
import Score from "./pages/score";
import ColorBlindTest from './pages/colorblindtest';

class App extends Component {

    constructor() {
        super()
        this.state = {
        }
    }


    onUnload(e) {

    }

    componentDidMount(params) {

    }

    componentWillUnmount() {
        //window.removeEventListener("beforeunload", this.onUnload);
    }

    render() {
        return (
            <>
                <div className="App">
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Intro} />
                            <Route exact path={"/tutorial"} component={Tutorial} />
                            <Route exact path="/experiment" component={VisQuiz} />
                            <Route exact path='/survey' component={Survey} />
                            <Route exact path='/score' component={Score} />
                            <Route exact path='/thank_you' component={ThankYou} />
                            <Route exact path='/colorblindtest' component={ColorBlindTest} />
                        </Switch>
                    </BrowserRouter>
                </div>

            </>
        );
    }
}

export default App;
