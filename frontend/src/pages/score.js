import React, { Component} from 'react';
import {Col, Row, Button, InputGroup, FormControl } from 'react-bootstrap';
import '../App.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import wrong from '../components/data/Images/RightAns.png';
import right from '../components/data/Images/WrongAns.png';
import skip from '../components/data/Images/skip.png'



class Score extends Component {

    componentDidMount() {
        if (this.props.location.state != null) {
            this.setState({
                value: this.props.location.state !== undefined ? this.props.location.state.data.session_id : "Invalid value",
                copied: false,
            })
        }
    }
    imgRender(arr_value) {
        if (arr_value === 1) {
            return wrong;
        }
        else if (arr_value === 0) {
            return right;
        }
        else if (arr_value === 2) {
            return skip;
        }
    }

    render() {
        console.log('attempting to render')

        if (this.props.location.state == null) {
            return (<p>Unknown session. Please start from the <a href={'#/'}> consent page</a></p>)
        }

        if (this.state == null) {
            return (<p>Loading...</p>)
        }

        return (
            <Row className={'justify-content-center no-margin-row'}>
                <Col lg={6} className={'text-box text-justify'}>
                    <div className='mechanical-code'>
                        <p className='mech_inst'>Thank you for participating in the study. Copy this code to Prolific.</p>



                        <InputGroup size='lg' className="mb-3">
                            <FormControl
                                placeholder="session_id"
                                aria-label="session_id"
                                aria-describedby="Session Code"
                                value={this.state.value}

                            />

                            <CopyToClipboard text={this.state.value}
                                onCopy={() => this.setState({ copied: true })}>
                                <Button
                                    variant="outline-secondary">{this.state.copied ? <>Copied!</> : <>Copy</>}</Button>
                            </CopyToClipboard>

                        </InputGroup>
                    </div>


                </Col>

            </Row >

        );
    }
}

export default Score;