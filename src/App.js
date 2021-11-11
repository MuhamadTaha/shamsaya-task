import './App.css';
import { Component } from 'react'
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      from_date: '',
      to_date: '',
      totalResponse: [],
      line_chart_data: [],
      answers: []
    };

  }

  from_date_fun = (e) => {
    this.setState({
      from_date: e.target.value
    })
  }

  to_date_fun = (e) => {
    this.setState({
      to_date: e.target.value
    })
  }

  check_error = () => {
    const { line_chart_data } = this.state
    if (line_chart_data == undefined || line_chart_data == null || line_chart_data == '') {
      document.getElementById('show-error').innerHTML = 'please try a different date !!'
      document.getElementById('show-error').classList.remove('hide')
      document.getElementById('show-success').innerHTML = ''
      document.getElementById('show-success').classList.add('hide')
    } else {
      document.getElementById('show-success').innerHTML = 'success'
      document.getElementById('show-success').classList.remove('hide')
      document.getElementById('show-error').innerHTML = ''
      document.getElementById('show-error').classList.add('hide')
    }
  }


  api_calling = () => {

    var self = this
    const from_date = this.state.from_date
    const to_date = this.state.to_date
    const headers = { 'Authorization': 'Bearer SLSmxK17vjRInEWIiFQjwE1QIDfeSM' };

    axios.get(`https://staging.mymelior.com/v1/branches/1/progress?date_from=${from_date}&date_to=${to_date}`, { headers })
      .then(function (response) {
        console.log(response.data);
        self.setState({
          line_chart_data: response.data.line_chart_data,
          answers: response.data.line_chart_data[0].answers
        })

      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        console.log('always happen');
        self.check_error()
      });

  }

  render() {

    const { line_chart_data } = this.state;
    const { answers } = this.state;


    const Chart = ({ children, height, width }) => (
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}> {children} </svg>
    )


    const Chart_Bar = ({ x, y, width, height, text }) => (
      <g>
        <rect x={x} y={y} width={width} height={height} />
        <text x={x} y={425} textLength={width} fontSize="20" fontWeight="bold" >Q {text}</text>
      </g>
    )


    const Bar_Chart = ({ answers }) => {
      const bar_width = 40
      const bar_Margin = 20
      const width = (bar_width + bar_Margin) * 4 - bar_Margin
      const height = 11 * 40
      debugger
      return (
        <Chart width={width} height={height}>
          {answers.map((answer, index) => {
            return (
              <Chart_Bar x={index * (bar_width + bar_Margin)} y={(10 - answer.choice) * 40} width={bar_width} height={answer.choice * 40} text={answer.question} />
            )
          })}
        </Chart>
      )
    }



    return (
      <div className="App">

        <h1> Shamsya Task </h1>

        <div className='calender-cont'>

          <input type='date' className='date' id='from-date' onChange={this.from_date_fun} />
          <input type='date' className='date' id='to-date' onChange={this.to_date_fun} />
          <input type='button' className='fetch' value='FETCH' onClick={this.api_calling} />

          <div id='handleError'>
            <span className='show-message hide' id='show-error'></span>
            <span className='show-message hide' id='show-success'></span>
          </div>

        </div>

        <div className='chart-cont'>

          <div className='svg-cont'>
            <Bar_Chart answers={this.state.answers} />
          </div>

          <div>
            {
              line_chart_data && line_chart_data.map(childs => {
                return (
                  <div className='data-cont' >
                    <h2 className='submitted-date'> {childs.submitted_at.slice(0,10)} </h2>
                    {childs.answers.map(answer => {
                      return (
                        <div className='data' key={Math.random()}>
                          <p> <span> Question: </span> {answer.question}</p>
                          <p> <span> Choice: </span> {answer.choice}</p>
                        </div>
                      )
                    })}
                  </div>
                )
              })
            }

          </div>

        </div>
      </div >
    );
  }
}

export default App;
