import React, { Component } from 'react';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import '../App.css';
import '../App2.css';
import ProgressBar from "@ramonak/react-progress-bar";
import ReactCountdownClock from 'react-countdown-clock';
import Countdown from 'react-countdown';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from 'axios';

import AreaChartMini from "../components/areaChart-mini";
import BarChartMini from "../components/barChart-mini";
import BubbleChartMini from "../components/bubbleChart-mini";
import ChoroplethMini from "../components/choropleth-mini";
import HistogramMini from "../components/histogram-mini";
import LineChartMini from "../components/linechart-mini";
import PieChartMini from "../components/pieChart-mini";
import ScatterPlotMini from "../components/scatterplot-mini";
import StackedBarChartMini from "../components/stacked100bar-mini";
import StackedAreaPlotMini from "../components/stackedArea-mini";
import StackedBarChart2Mini from "../components/stackedbar-mini";
import TreeMapMini from "../components/treeMap-mini";

var num = 16
let initTime = 0
let endTime = 0
var score_2 = 0

let attention_question = ['Please select \'1\'.', 'Please select \'2\'.', 'Please select \'3\'.', 'Please select \'4\'.', 'Please select \'5\'.', 'Please select \'6\'.', 'Please select \'7\'.']

// let minivis = [
//     { 'vis': BarChartMini, 'type': 'BarChart', 'question': 'What is the average internet speed in Japan?', 'options': ["42.30 Mbps", "40.51 Mbps", "35.25 Mbps", "16.16 Mbps", "Skip"], 'correct_answer': 1 },
//     { 'vis': AreaChartMini, 'type': 'AreaChart', 'question': 'What was the average price of pount of coffee beans in October 2019?', 'options': ["$0.71", "$0.90", "$0.80", "$0.63", "Skip"], 'correct_answer': 0 },
//     { 'vis': BubbleChartMini, 'type': 'BubbleChart', 'question': 'Which city\'s metro system has the largest number of stations?', 'options': ['Beijing', 'Shanghai', 'London', 'Seoul', "Skip"], 'correct_answer': 1 },
//     { 'vis': ChoroplethMini, 'type': 'Choropleth', 'question': 'In 2020, the unemployment rate for Washington (WA) was higher than that of Wisconsin (WI).', 'options': ['True', 'False', "Skip"], 'correct_answer': 0 },
//     { 'vis': HistogramMini, 'type': 'Histogram', 'question': 'What distance have customers traveled in the taxi the most?', 'options': ["60 - 70 Km", "30 - 40 Km", "20 - 30 Km", "50 - 60 Km", "Skip"], 'correct_answer': 1 },
//     { 'vis': LineChartMini, 'type': 'LineChart', 'question': 'What was the price of a barrel of oil in February 2020?', 'options': ["$50.54", "$47.02", "$42.34", "$42.34", "Skip"], 'correct_answer': 0 },
//     { 'vis': TreeMapMini, 'type': 'TreeMap', 'question': 'eBay is nested in the Software category.', 'options': ['True', 'False', 'Skip'], 'correct_answer': 1 },
//     { 'vis': ScatterPlotMini, 'type': 'ScatterPlot', 'question': 'There is a negative linear relationship between the height and the weight of the 85 males.', 'options': ['True', 'False', 'Skip'], 'correct_answer': 1 },
//     { 'vis': StackedBarChartMini, 'type': 'StackedBarChart', 'question': 'Which country has the lowest proportion of Gold medals?', 'options': ["Great Britain", "U.S.A.", "Japan", "Australia", 'Skip'], 'correct_answer': 0 },
//     { 'vis': StackedAreaPlotMini, 'type': 'StackedAreaPlot', 'question': 'What was the ratio of girls named \'Isla\' to girls named \'Amelia\' in 2012 in the UK?', 'options': ["1 to 1", "1 to 2", "1 to 3", "1 to 4", "Skip"], 'correct_answer': 1 },
//     { 'vis': StackedBarChart2Mini, 'type': 'StackedBarChart2', 'question': 'What is the cost of peanuts in Seoul?', 'options': ["$6.1", "$5.2", "$7.5", "$4.5", "Skip"], 'correct_answer': 0 },
//     { 'vis': PieChartMini, 'type': 'PieChart', 'question': 'What is the approximate global smartphone market share of Samsung?', 'options': ["17.6%", "25.3%", "10.9%", "35.2%", 'Skip'], 'correct_answer': 0 }
// ];


class VisQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response_likert: [
                { value: 1, text: "Please select \'1\'.", checked: false },
                { value: 2, text: "Please select \'2\'.", checked: false },
                { value: 3, text: "Please select \'3\'.", checked: false },
                { value: 4, text: "Please select \'4\'.", checked: false },
                { value: 5, text: "Please select \'5\'.", checked: false },
                { value: 6, text: "Please select \'6\'.", checked: false },
                { value: 7, text: "Please select \'7\'.", checked: false }
            ]
        }
    }

    componentDidMount() {
        this.setState({
            session_id: this.props.location.state.data.session_id,
            current_visualization_index: 0,
            current_mini_index: 0,
            list_attention: this.shuffle(attention_question),
            radioCounter: 0,
            score: 0,
            responses: {},
            mini_responses: {},
            time_record: {},
            resize_bool: true,
            device_info: '',
            form_incomplete: false,
            mini_score: 0,
            demographic_questions: {
                'sex': null,
                'age': null,
                'education': null
            },
            demographics_incomplete: true,
            comment: '',
            comment2: '',
            width: 0,
            height: 0,
            image_list: null,
            ip_address: "",
            two_choice: [],
            four_choicec: [],
            twoscore: 0,
            fourscore: 0,
            corrected_score: 0,
            quesRand: "Please select \'1\'.",
            // question_types: 'massvis'
        }
        )

        this.get_image_list();

        window.addEventListener('resize', this.handleWindowResize.bind(this))
    }

    handleWindowResize(e) {
        this.setState({
            resize_bool: !this.state.resize_bool
        })
    }
    handleTextChange(e) {
        this.setState({ comment: e.target.value })
    }
    handleTextChange2(e) {
        this.setState({ comment2: e.target.value })
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
        if (e.value === 'oth') {
            alert('Hello')
        }

        this.setState({ demographic_questions: new_dq, demographics_incomplete: incomplete })
    }
    getData = async () => {
        //https://medium.com/how-to-react/how-to-get-user-ip-address-in-react-js-73eb295720d0
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log("IP Address:  ", res.data);
        this.setState({
            ip_address: res.data.IPv4
        })
    }

    shuffle(array) {
        //https://bost.ocks.org/mike/shuffle/
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    get_image_list() {
        fetch('./get_random_images', {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: 'POST',
        })
            .then(res => res.json()).then(data => {
                console.log(data.files)
                this.setState({ image_list: data.files })
            })
    }

    on_survey_click() {

        fetch('./record_responses_to_db', {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                session_id: this.state.session_id,
                responses: this.state.responses,
                mini_responses: this.state.mini_responses,
                device: this.state.device_info,
                demographic_responses: this.state.demographic_questions,
                comment: this.state.comment,
                comment2: this.state.comment2,
                height: window.innerHeight,
                width: window.innerWidth,
                ipaddress: this.state.ip_address
            })
        })
            .then(res => res.json()).then(data => {
                //var message = 'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
                //e.returnValue = message;
                //return message;
            })

        var pageType = {
            pathname: '/score',
            state: {
                data: {
                    'session_id': this.state.session_id,
                }
            }
        }
        this.props.history.push(pageType)
    }

    record_ques(img, name, id, response_type, time) {
        console.log("hello" + response_type)

        //console.log(img in this.state.responses)
        if (!(img in this.state.responses)) {
            //console.log('CONDITIONAL EXECUTING')
            this.state.responses[img] = []
        }

        if (document.getElementById('1').checked || document.getElementById('2').checked || document.getElementById('3').checked || document.getElementById('4').checked || document.getElementById('5').checked || document.getElementById('6').checked || document.getElementById('7').checked) {
            var select1 = document.querySelector('input[name=likert_1]:checked');
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.responses[img].push({ name: name, id: id, response: response_type, time: endTime });
            this.setState({
                radioCounter: this.state.radioCounter + 1,
            })
            console.log('value: ' + select1.value);
            console.log('radio counter: ' + this.state.radioCounter);

        }
        else if (document.getElementById('8').checked || document.getElementById('9').checked || document.getElementById('10').checked || document.getElementById('11').checked || document.getElementById('12').checked || document.getElementById('13').checked || document.getElementById('14').checked) {
            var select2 = document.querySelector('input[name=likert_2]:checked');
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.responses[img].push({ name: name, id: id, response: response_type, time: endTime });
            this.setState({
                radioCounter: this.state.radioCounter + 1,
            })
            console.log('value: ' + select2.value);
            console.log('radio counter: ' + this.state.radioCounter);

        }
        else if (document.getElementById('15').checked || document.getElementById('16').checked || document.getElementById('17').checked || document.getElementById('18').checked || document.getElementById('19').checked || document.getElementById('20').checked || document.getElementById('21').checked) {
            var select3 = document.querySelector('input[name=likert_3]:checked');
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.responses[img].push({ name: name, id: id, response: response_type, time: endTime });
            //radioCounter = 3;
            this.setState({
                radioCounter: this.state.radioCounter + 1,
            })
            console.log('value: ' + select3.value);
            console.log('radio counter: ' + this.state.radioCounter);

        }
        else if (document.getElementById('22').checked || document.getElementById('23').checked || document.getElementById('24').checked || document.getElementById('25').checked || document.getElementById('26').checked || document.getElementById('27').checked || document.getElementById('28').checked) {
            var select4 = document.querySelector('input[name=likert_4]:checked');
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.responses[img].push({ name: name, id: id, response: response_type, time: endTime });
            this.setState({
                radioCounter: this.state.radioCounter + 1,
            })
            console.log('value: ' + select4.value);
            console.log('radio counter: ' + this.state.radioCounter);

        }
        else if (document.getElementById('29').checked || document.getElementById('30').checked || document.getElementById('31').checked || document.getElementById('32').checked || document.getElementById('33').checked || document.getElementById('34').checked || document.getElementById('35').checked) {
            var select5 = document.querySelector('input[name=likert_5]:checked');
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.responses[img].push({ name: name, id: id, response: response_type, time: endTime });
            this.setState({
                radioCounter: this.state.radioCounter + 1,
            })
            console.log('value: ' + select5.value);
            console.log('radio counter: ' + this.state.radioCounter);

        }

        else if (document.getElementById('36').checked || document.getElementById('37').checked || document.getElementById('38').checked || document.getElementById('39').checked || document.getElementById('40').checked || document.getElementById('41').checked || document.getElementById('42').checked) {
            var select12 = document.querySelector('input[name=likert_6]:checked');
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.responses[img].push({ name: name, id: id, response: response_type, time: endTime })
            this.setState({
                radioCounter: this.state.radioCounter + 1,
            })
            console.log('value: ' + select12.value);
            console.log('radio counter: ' + this.state.radioCounter);


        }
        //}

        //console.log('RESPONSES', this.state.responses)
        console.log("Which one is clicked: ")
    }
    // continue_sec() {
    //     this.setState({
    //         question_types: 'minivlat',
    //     })
    // }

    next_btn(imgName, time) {
        if (this.state.radioCounter >= 6) {
            //alert('All questions answered. Proceeding to next question.');
            //clear radio buttons
            var radios = document.getElementsByTagName('input');
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].type === 'radio' && radios[i].checked) {
                    radios[i].checked = false
                }
            }

            //add index
            console.log("Next button is clicked")
            this.setState({
                current_visualization_index: this.state.current_visualization_index + 1,
            })

            //reset radio counter (radioCounter = 0;)
            this.setState({
                radioCounter: 0,
            })

            //reset image size
            document.getElementById('reset_btn').click();


            //var images1 = document.getElementById("zoomA");
            //var currWidth = images1.clientWidth;
            //images1.style.width = (currWidth + 100) + "%";
            endTime = Math.abs((Date.now() - initTime) / 1000)
            this.state.time_record[imgName] = { time: endTime }
            //this.state.time_record.append(endTime)


        }

        else {
            alert('Not all questions have been answered, yet.');
        }

        const randQues = this.shuffle(attention_question)[0]
        this.setState({
            quesRand: randQues
        })
        console.log("Random question is: ", this.state.quesRand)
    }



    render() {
        initTime = Date.now()
        console.log("Starting Time is : " + initTime)
        console.log('render')

        if (this.props.location.state === undefined) {
            window.location.href = "/";
            return (<p>Unknown session. Please start from the <a href={'/'}> consent page</a></p>)
        }
        let ages = []
        for (var i = 18; i < 100; i++) {
            ages.push(i)
        }

        if (this.state == null || this.state.image_list == null) {
            return (<p>Loading...</p>)
        }
        // if (this.state.question_types === 'massvis') {
        if (this.state.current_visualization_index < 16) {
            console.log('render')
            console.log("Index is " + this.state.current_visualization_index)
            let src_img = this.state.current_visualization_index
            return (
                <Container className={'container-class'} fluid>
                    <Row className={'vis-quiz-row2'}>
                        <Col lg={6} className={'vis-column2'}>
                            <TransformWrapper initialScale={1} defaultPositionX={100} defaultPositionY={200}>
                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                    <React.Fragment>
                                        <div className="tools">
                                            <button className="icon-btn" title="Zoom In" onClick={() => zoomIn()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="zoom-glass" id="magnigfying-glass" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                                                    <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z" />
                                                    <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5z" />
                                                </svg>
                                            </button>
                                            <button className="icon-btn" title="Zoom Out" onClick={() => zoomOut()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="zoom-out-glass" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                                                    <path d="M10.344 11.742c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1 6.538 6.538 0 0 1-1.398 1.4z" />
                                                    <path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                                                </svg>
                                            </button>
                                            <button className="icon-btn" id='reset_btn' title="Full Image" onClick={() => resetTransform()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="reset" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                                                </svg>
                                            </button>


                                        </div>

                                        {/*contentStyle={{ width: 700, height: 700}}*/}
                                        <TransformComponent contentStyle={{ width: '95vh', height: '70vh' }} >
                                            <img src={`./get_image?image_name=${this.state.image_list[src_img]}`} id="zoomA" className='img_rand' alt="data visualization"></img>
                                        </TransformComponent>

                                    </React.Fragment>
                                )}
                            </TransformWrapper>
                        </Col>
                        <Col lg={6} className='wrap2'>
                            <p className={"likert-header"}>Tell us what you think of this visualization (1 - Strongly Disagree and 7 - Strongly Agree)</p>
                            <form action="">
                                <label className='statement'>To what extent do you agree that this visual representation is enjoyable?</label>
                                <ul className={'likerts'}>
                                    <li>
                                        <input id='1' type='radio' name='likert_1' value='Strong_agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 1, '1', 'timetaken')
                                        } />
                                        <label>1</label>
                                    </li>
                                    <li>
                                        <input id='2' type='radio' name='likert_1' value='agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 2, '2', 'timetaken')
                                        } />
                                        <label> 2</label>
                                    </li>
                                    <li>
                                        <input id='3' type='radio' name='likert_1' value='nor' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 3, '3', 'timetaken')
                                        } />
                                        <label>3</label>
                                    </li>
                                    <li>
                                        <input id='4' type='radio' name='likert_1' value='dis' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 4, '4', 'timetaken')
                                        } />
                                        <label>4</label>
                                    </li>
                                    <li>
                                        <input id='5' type='radio' name='likert_1' value='std' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 5, '5', 'timetaken')
                                        } />
                                        <label>5</label>
                                    </li>
                                    <li>
                                        <input id='6' type='radio' name='likert_1' value='na' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 6, '6', 'timetaken')
                                        } />
                                        <label>6</label>
                                    </li>
                                    <li>
                                        <input id='7' type='radio' name='likert_1' value='ns' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is enjoyable?', 7, '7', 'timetaken')
                                        } />
                                        <label>7</label>
                                    </li>
                                </ul>
                                <label className='statement'>To what extent do you agree that this visual representation is likable?</label>
                                <ul className={'likerts'}>
                                    <li>
                                        <input id='8' type='radio' name='likert_2' value='Strong_agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 8, '1', 'timetaken')
                                        } />
                                        <label>1</label>
                                    </li>
                                    <li>
                                        <input id='9' type='radio' name='likert_2' value='agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 9, '2', 'timetaken')
                                        } />
                                        <label> 2</label>
                                    </li>
                                    <li>
                                        <input id='10' type='radio' name='likert_2' value='nor' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 10, '3', 'timetaken')
                                        } />
                                        <label>3</label>
                                    </li>
                                    <li>
                                        <input id='11' type='radio' name='likert_2' value='dis' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 11, '4', 'timetaken')
                                        } />
                                        <label>4</label>
                                    </li>
                                    <li>
                                        <input id='12' type='radio' name='likert_2' value='std' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 12, '5', 'timetaken')
                                        } />
                                        <label>5</label>
                                    </li>
                                    <li>
                                        <input id='13' type='radio' name='likert_2' value='na' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 13, '6', 'timetaken')
                                        } />
                                        <label>6</label>
                                    </li>
                                    <li>
                                        <input id='14' type='radio' name='likert_2' value='ns' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is likable?', 14, '7', 'timetaken')
                                        } />
                                        <label>7</label>
                                    </li>
                                </ul>
                                <label className='statement'>To what extent do you agree that this visual representation is pleasing?</label>
                                <ul className={'likerts'}>
                                    <li>
                                        <input id='15' type='radio' name='likert_3' value='Strong_agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 15, '1', 'timetaken')
                                        } />
                                        <label>1</label>
                                    </li>
                                    <li>
                                        <input id='16' type='radio' name='likert_3' value='agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 16, '2', 'timetaken')
                                        } />
                                        <label> 2</label>
                                    </li>
                                    <li>
                                        <input id='17' type='radio' name='likert_3' value='nor' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 17, '3', 'timetaken')
                                        } />
                                        <label>3</label>
                                    </li>
                                    <li>
                                        <input id='18' type='radio' name='likert_3' value='dis' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 18, '4', 'timetaken')
                                        } />
                                        <label>4</label>
                                    </li>
                                    <li>
                                        <input id='19' type='radio' name='likert_3' value='std' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 19, '5', 'timetaken')
                                        } />
                                        <label>5</label>
                                    </li>
                                    <li>
                                        <input id='20' type='radio' name='likert_3' value='na' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 20, '6', 'timetaken')
                                        } />
                                        <label>6</label>
                                    </li>
                                    <li>
                                        <input id='21' type='radio' name='likert_3' value='ns' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is pleasing?', 21, '7', 'timetaken')
                                        } />
                                        <label>7</label>
                                    </li>
                                </ul>
                                <label className='statement'>To what extent do you agree that this visual representation is nice?</label>
                                <ul className={'likerts'}>
                                    <li>
                                        <input id='22' type='radio' name='likert_4' value='Strong_agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 22, '1', 'timetaken')
                                        } />
                                        <label>1</label>
                                    </li>
                                    <li>
                                        <input id='23' type='radio' name='likert_4' value='agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 23, '2', 'timetaken')
                                        } />
                                        <label> 2</label>
                                    </li>
                                    <li>
                                        <input id='24' type='radio' name='likert_4' value='nor' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 24, '3', 'timetaken')
                                        } />
                                        <label>3</label>
                                    </li>
                                    <li>
                                        <input id='25' type='radio' name='likert_4' value='dis' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 25, '4', 'timetaken')
                                        } />
                                        <label>4</label>
                                    </li>
                                    <li>
                                        <input id='26' type='radio' name='likert_4' value='std' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 26, '5', 'timetaken')
                                        } />
                                        <label>5</label>
                                    </li>
                                    <li>
                                        <input id='27' type='radio' name='likert_4' value='na' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 27, '6', 'timetaken')
                                        } />
                                        <label>6</label>
                                    </li>
                                    <li>
                                        <input id='28' type='radio' name='likert_4' value='ns' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is nice?', 28, '7', 'timetaken')
                                        } />
                                        <label>7</label>
                                    </li>
                                </ul>
                                <label className='statement'>To what extent do you agree that this visual representation is appealing?</label>
                                <ul className={'likerts'}>
                                    <li>
                                        <input id='29' type='radio' name='likert_5' value='Strong_agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 29, '1', 'timetaken')
                                        } />
                                        <label>1</label>
                                    </li>
                                    <li>
                                        <input id='30' type='radio' name='likert_5' value='agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 30, '2', 'timetaken')
                                        } />
                                        <label> 2</label>
                                    </li>
                                    <li>
                                        <input id='31' type='radio' name='likert_5' value='nor' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 31, '3', 'timetaken')
                                        } />
                                        <label>3</label>
                                    </li>
                                    <li>
                                        <input id='32' type='radio' name='likert_5' value='dis' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 32, '4', 'timetaken')
                                        } />
                                        <label>4</label>
                                    </li>
                                    <li>
                                        <input id='33' type='radio' name='likert_5' value='std' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 33, '5', 'timetaken')
                                        } />
                                        <label>5</label>
                                    </li>
                                    <li>
                                        <input id='34' type='radio' name='likert_5' value='na' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 34, '6', 'timetaken')
                                        } />
                                        <label>6</label>
                                    </li>
                                    <li>
                                        <input id='35' type='radio' name='likert_5' value='ns' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], 'To what extent do you agree that this visual representation is appealing?', 35, '7', 'timetaken')
                                        } />
                                        <label>7</label>
                                    </li>
                                </ul>
                                <label className='statement'>{this.state.quesRand}</label>
                                <ul className={'likerts'}>
                                    <li>
                                        <input id='36' type='radio' name='likert_6' value='Strong_agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 36, '1', 'timetaken')
                                        } />
                                        <label>1</label>
                                    </li>
                                    <li>
                                        <input id='37' type='radio' name='likert_6' value='agree' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 37, '2', 'timetaken')
                                        } />
                                        <label> 2</label>
                                    </li>
                                    <li>
                                        <input id='38' type='radio' name='likert_6' value='nor' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 38, '3', 'timetaken')
                                        } />
                                        <label>3</label>
                                    </li>
                                    <li>
                                        <input id='39' type='radio' name='likert_6' value='dis' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 39, '4', 'timetaken')
                                        } />
                                        <label>4</label>
                                    </li>
                                    <li>
                                        <input id='40' type='radio' name='likert_6' value='std' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 40, '5', 'timetaken')
                                        } />
                                        <label>5</label>
                                    </li>
                                    <li>
                                        <input id='41' type='radio' name='likert_6' value='na' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 41, '6', 'timetaken')
                                        } />
                                        <label>6</label>
                                    </li>
                                    <li>
                                        <input id='42' type='radio' name='likert_6' value='ns' onClick={() =>
                                            this.record_ques(this.state.image_list[src_img], this.state.quesRand, 42, '7', 'timetaken')
                                        } />
                                        <label>7</label>
                                    </li>
                                </ul>

                                <div className={'sub-btn'}>

                                    <button id={'nxt-btn'} className={'btn-1'} type={"button"} onClick={() =>
                                        this.next_btn(this.state.image_list[src_img], 'timetaken')}>Next</button>
                                </div>

                            </form>
                        </Col>
                        <Row className={'progress-bar-row'}>
                            <ProgressBar completed={(parseInt(this.state.current_visualization_index)).toString()} customLabel={`${parseInt(this.state.current_visualization_index)} of 16`} maxCompleted={num.toString()} length={Math.min(window.innerWidth, window.innerHeight)} />
                        </Row>
                    </Row>

                </Container>
            )
        }
        // }
        else {
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
                                <Form.Label>Please select your gender.</Form.Label>
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
                                <Form.Label>Based on your personal preferences and perceptions, what specific elements or characteristics do you believe contribute to making a data visualization visually beautiful?</Form.Label>
                                <Form.Control as="textarea" id={'comments'} rows={3} onChange={this.handleTextChange.bind(this)}>
                                </Form.Control>
                            </Form.Group>
                            <hr />


                            <Form.Group>
                                <Form.Label>Please include any additional comments below. (optional)</Form.Label>
                                <Form.Control as="textarea" id={'comments2'} rows={3} onChange={this.handleTextChange2.bind(this)}>
                                </Form.Control>
                            </Form.Group>
                            <hr />


                            <div className={'text-center'}><Button className={'btn-sm'}
                                variant={"success"}
                                onClick={this.on_survey_click.bind(this)}
                                disabled={(this.state.form_incomplete || this.state.demographics_incomplete)}
                                id={'survey_submit-btn'}>
                                Submit Responses
                            </Button></div>

                            <p className={'text-box'}></p>
                        </Col>

                    </Row>
                </>
            )
        }
    }
}

export default VisQuiz;
