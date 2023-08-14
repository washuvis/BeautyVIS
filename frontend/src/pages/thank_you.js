import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap';

class ThankYou extends Component {

    componentDidMount() {
        if (this.props.location.state != null) {
            this.setState({
                value: this.props.location.state !== undefined ? this.props.location.state.data.session_id : "Invalid value",
                copied: false,
            })
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
                    <p>Thank you for participating in our study. You responses have been recorded.</p>


                    {/*
                    <InputGroup size='lg' className="mb-3">
                        <FormControl
                            placeholder="session_id"
                            aria-label="session_id"
                            aria-describedby="Session Code"
                            value={this.state.value}

                        />

                        <CopyToClipboard text={this.state.value}
                                         onCopy={() => this.setState({copied: true})}>
                            <Button
                                variant="outline-secondary">{this.state.copied ? <>Copied!</> : <>Copy</>}</Button>
                        </CopyToClipboard>

                    </InputGroup> */}


                </Col>

            </Row>

        );
    }
}

export default ThankYou;
