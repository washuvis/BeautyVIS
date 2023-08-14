import React, { Component } from 'react';
import { Col, Row, Button, Container } from 'react-bootstrap';
import '../App.css';
import img1 from './icons/zoomin.png'
import img2 from './icons/zoomout.png'
import img3 from './icons/reset.png'
import ColorBlind from "../components/colorblind";
// import zoomout from '../icons/zoomout.png'
// import reseticon from '../icons/reset.png'


let color_ques = [
    { 'vis': ColorBlind, 'question': 'Which two numbers are shown in the image?', 'options': ["87-48", "27-47", "27-42", "87-22"], 'correct_answer': 2 }
]
// uncomment if running on local backend
const backend_path_prefix = '.'

class Tutorial extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    onUnload(e) {

    }

    on_experiment_click(response, truth) {

        if (response == color_ques[0]['options'][truth]) {
            var pageType = {
                pathname: '/experiment',
                state: {
                    data: {
                        'session_id': this.state.session_id,
                    }
                }
            }
            console.log(pageType)
            this.props.history.push(pageType)
        }
        else {
            console.log("You do not qualify for this test.")
            var pageType = {
                pathname: '/colorblindtest',
                state: {
                    data: {

                    }
                }
            }
            console.log(pageType)
            this.props.history.push(pageType)
        }

    }

    componentDidMount() {

        fetch('./new_session_id', {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                start_time: 'TODO'
            })
        })
            .then(res => res.json()).then(data => {
                console.log(data.new_id)
                this.setState({
                    session_id: data.new_id
                })
            })

    }

    componentWillUnmount() {
        //window.removeEventListener("beforeunload", this.onUnload);
    }

    render() {

        if (this.props.location.state == null) {
            return (<p>Unknown session. Please start from the <a href={'#/'}> consent page</a></p>)
        }
        let VisComp = ColorBlind
        const options = color_ques[0]['options'].map((item, i) =>
            <button variant="secondary" size="sm" className={'inst-button'} id={`button_option_${i}`} key={`button_option_${i}`} onClick={() =>
                this.on_experiment_click(item, color_ques[0]['correct_answer'])}>
                {item}
            </button>
        )

        return (
            <Container className={'instruction-class'} fluid>
                <Row className={'list-inst'}>

                    <p className='head_1'>This test aims at understanding how visualization designs regulate the perception of trust.</p>
                    <ul>
                        <li className='int_1'>You will complete a visualization survey. For each visualization, you will be asked to rate how much you agree with the statements associated with each visualization.</li>
                        {/* <li className='int_1'>For each statement, you will be asked to rate your level of agreement with each statement.</li> */}
                        {/* <li className='int_1'>You will be given 25 seconds to answer each multiple-choice question. If you are unsure of the answer, you may skip the question instead of guessing.</li> */}
                        <li className='int_1'>You will have the option to zoom-in <img src={img1} alt='zin' style={{ width: "3%", height: "3%" }} /> and zoom-out <img src={img2} alt='zout' style={{ width: "3%", height: "3%" }} /> of the visualization. You can use <img src={img3} alt='zout' style={{ width: "3%", height: "3%" }} /> to reset the visualization to its original size. <b>You can also use mouse scroll to zoom-in and zoom-out. </b></li>
                        <li className='int_1'>For a better exprience, use your desktop/laptop/Mac to attempt this experiment.</li>
                        <li className='int_1'>Please do not take this test if you are color blind. <b>Answer the question below before starting the experiment.</b></li>
                        {/* <li>We will store information about your mouse interaction (e.g. what you clicked) when answering the survey questions.</li> */}

                    </ul>

                    {/* <div className={'text-center'}>
                            <Button onClick={this.on_experiment_click.bind(this)}
                                className={'btn-sm'} variant={"success"}>
                                Start the experiment.
                            </Button>
                        </div>


                        <p className={'text-box'}></p> */}

                </Row>
                <Row className={'color_quiz'}>
                    <Col lg={6} className={'vis-column'}>
                        <VisComp width={window.innerWidth} height={window.innerHeight} resized={this.state.resize_bool}></VisComp>
                    </Col>
                    <Col lg={6} className={'quiz-column'}>
                        <div className={'question-container'}>
                            <div className={'question-text'}>
                                <p><b>{color_ques[0]['question']}</b></p>
                            </div>

                            <div className={'question-options d-grid gap-2 btn-block'}>
                                {options}
                            </div>
                        </div>

                    </Col>
                </Row>

            </Container>
        );
    }
}

export default Tutorial;
