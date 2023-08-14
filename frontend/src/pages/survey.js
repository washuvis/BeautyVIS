import React, { Component, useState } from 'react';
import { Col, Row, Button, ButtonGroup, ToggleButton, Form } from 'react-bootstrap';


function SurveyQuestion(props) {
    const [radioValue, setRadioValue] = useState('-1');

    let radios = [
        { 'name': 'Strongly Disagree', value: '1' },
        { 'name': 'Disagree', value: '2' },
        { 'name': 'Neutral', value: '3' },
        { 'name': 'Agree', value: '4' },
        { 'name': 'Strongly Agree', value: '5' }
    ]

    return (
        <>
            <p> {props.question} </p>

            <ButtonGroup toggle className={'question'}>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="outline-secondary"
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => {
                            setRadioValue(e.currentTarget.value);
                            props.onChangeFn(props.question_id, e.currentTarget.value)
                        }}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

            <hr></hr>


        </>
    );
}


class Survey extends Component {

    constructor(props) {
        super(props);


        this.state = {
            session_id: null,
            form_incomplete: false,
            responses: {},
            demographic_questions: {
                'sex': null,
                'age': null,
                'education': null
            },
            demographics_incomplete: true,
            comment: ''
        }
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            this.setState({
                session_id: this.props.location.state.data.session_id,
            }
            )
        }
    }

    handleTextChange(e) {
        this.setState({ comment: e.target.value })
    }

    handleChange(question_id, value) {
        var resp = this.state.responses
        resp[question_id] = value

        var incomplete = false
        for (var key in resp) {
            if (resp[key] == null) {
                incomplete = true
            }
        }

        this.setState({ form_incomplete: incomplete, responses: resp })

    }

    handleDemographicChange(e) {
        console.log(this.state)
        var new_dq = this.state.demographic_questions
        new_dq[e.target.id] = e.target.value

        var incomplete = false
        for (var key in new_dq) {
            if (new_dq[key] == null) {
                incomplete = true
            }
        }

        this.setState({ demographic_questions: new_dq, demographics_incomplete: incomplete })
    }

    on_submit_click() {

        fetch('./record_survey_to_db', {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                session_id: this.state.session_id,
                responses: this.state.responses,
                demographic_responses: this.state.demographic_questions,
                comment: this.state.comment
            })
        })
            .then(res => res.json()).then(data => {
                //var message = 'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
                //e.returnValue = message;
                //return message;
            })

        var pageType = {
            pathname: '/thank_you',
            state: {
                data: {
                    'session_id': this.state.session_id,
                }
            }
        }
        this.props.history.push(pageType)
    }

    render() {

        if (this.props.location.state == null) {
            return (<p>Unknown session. Please start from the <a href={'#/'}> consent page</a></p>)
        }

        let ages = []
        for (var i = 18; i < 100; i++) {
            ages.push(i)
        }

        return (
            <>
                <Row className={'justify-content-center no-margin-row'}>
                    <Col lg={6} className={'text-box text-justify'}>


                        <Form.Group className={'question'}>
                            <Form.Label>Please select your age.</Form.Label>
                            <Form.Select as="select" id={'age'} onChange={this.handleDemographicChange.bind(this)}>
                                <option value={null} selected={true} disabled={true}></option>
                                {ages.map((d, i) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <hr />

                        <Form.Group className={'question'}>
                            <Form.Label>Please select your sex.</Form.Label>
                            <Form.Select as="select" id={'sex'} onChange={this.handleDemographicChange.bind(this)}>
                                <option value={null} selected={true} disabled={true}></option>
                                <option key={'male'} value={'male'}>Male</option>
                                <option key={'female'} value={'female'}>Female</option>
                                <option key={'other'} value={'other'}>Other</option>
                                <option key={'withdraw'} value={'withdraw'}>I do not wish to disclose.</option>
                            </Form.Select>
                        </Form.Group>
                        <hr />

                        <Form.Group className={'question'}>
                            <Form.Label>Please select your highest level of completed education.</Form.Label>
                            <Form.Select as="select" id={'education'} onChange={this.handleDemographicChange.bind(this)}>
                                <option value={null} selected={true} disabled={true}></option>
                                <option value={'highschool'}>High School Diploma / GED</option>
                                <option value={'associate'}>Associate Degree</option>
                                <option value={'bachelors'}>Bachelors Degree</option>
                                <option value={'masters'}>Masters Degree</option>
                                <option value={'doctorate'}>Doctorate Degree</option>
                            </Form.Select>
                        </Form.Group>
                        <hr />


                        <Form.Group>
                            <Form.Label>Please include any additional comments below. (optional)</Form.Label>
                            <Form.Control as="textarea" id={'comments'} rows={3} onChange={this.handleTextChange.bind(this)}>
                            </Form.Control>
                        </Form.Group>
                        <hr />


                        <div className={'text-center'}><Button className={'btn-sm'}
                            variant={"success"}
                            onClick={this.on_submit_click.bind(this)}
                            disabled={(this.state.form_incomplete || this.state.demographics_incomplete)}
                            id={'survey_submit-btn'}>
                            Submit Responses
                        </Button></div>

                        <p className={'text-box'}></p>
                    </Col>

                </Row>
            </>
        );
    }
}

export default Survey;
