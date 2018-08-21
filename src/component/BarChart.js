import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
// window.d3 = d3;

const svgHeight = 600;
const svgWidth = 800;
const padding = 60;

const barWidth = 10;

export default class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      data: null,
      errorMessage: null
    }
    this.d3Container = React.createRef();
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      } else {
        this.handleError('Request failed with errorCode: ', resp, 'status')
        this.setState({ fetching: false });
      }
    })
      .then((payload) => {
        if (payload) {
          const { data } = payload;

          this.setState({
            fetching: false,
            data
          }, () => {
            this.buildGraph(data)
          });
        }
      })
      .catch((err) => {
        console.error(err)
        this.setState({ errorMessage: 'Failed to load GDP data', err });
      })
  }

  handleError = (errorString, errorObject, key, setState = true) => {
    if (errorObject && key) {
      const errorMessage = `${errorString}${errorObject[key]}`;
      console.warn(errorMessage);

      if (setState) {
        this.setState({ errorMessage });
      }
    }
  }


  buildGraph = (data) => {
    // the svg element we will modify
    const node = this.d3Container.current;
    // helper function to parse year from string such as '1975-01-01'
    const getYear = yearMonthDay => yearMonthDay.match(/^\d{4}/)[0];

    const gdpArray = [],
          yearsArray = [];

    for (let i = 0; i < data.length; i++) {
      gdpArray.push(data[i][1]);
      yearsArray.push(getYear(data[i][0]));
    }



    // get the min and max values for each scale (gdp on y and years on x)
    const minGdp = Math.min(...gdpArray),
          maxGdp = Math.max(...gdpArray),
          minYear = Math.min(...yearsArray),
          maxYear = Math.max(...yearsArray);


    // create a linear scale
    const yScale = d3.scaleLinear()
      .domain([minGdp, maxGdp])
      .range([padding, svgHeight - padding]);

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
       // .domain([0, (data.length - 1) * 10])
      .range([padding, svgWidth - 20]);

    // append rect elements
    d3.select(node)
      .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('x', (d, i) => xScale(getYear(d[0])))
        .attr('y', d => svgHeight - (padding + yScale(d[1])))
        .attr('height', d => yScale((d[1])))
        // append a title tooltip with the gdp value to each rect
        .append('title')
        .text(d => d[1]);


      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      d3.select(node)
        .append('g')
        .attr("transform", `translate(0, ${(svgHeight - padding)})`)
        .call(xAxis);

      d3.select(node)
        .append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);


      // d3.select(node)
      //   .selectAll('text')
      //     .data(data)
      //     .enter()
      //     .append('text')
      //     .attr('x', (d, i) => i * 10)
      //     .attr('y', d => 600 - ( d[1] / 3) - 3)
      //     .text(d => Math.round(d[1]))

  }

  // NOTE: this is only for reference
//   createBarChart() {
//    const node = this.node
//    const dataMax = max(this.props.data)
//    const yScale = scaleLinear()
//       .domain([0, dataMax])
//       .range([0, this.props.size[1]])
// select(node)
//    .selectAll('rect')
//    .data(this.props.data)
//    .enter()
//    .append('rect')
//
// select(node)
//    .selectAll('rect')
//    .data(this.props.data)
//    .exit()
//    .remove()
//
// select(node)
//    .selectAll('rect')
//    .data(this.props.data)
//    .style('fill', '#fe9922')
//    .attr('x', (d,i) => i * 25)
//    .attr('y', d => this.props.size[1] — yScale(d))
//    .attr('height', d => yScale(d))
//    .attr('width', 25)
// }


  render() {
    const {
      errorMessage,
      fetching,
      data
    } = this.state;

    return (
      <Chart>
        { errorMessage && <Error>{ errorMessage }</Error> }
        { /* TODO - replace with spinner */}
        { fetching && !errorMessage && <span style={{color: 'black'}}>'loading...'</span> }
        { data && !fetching && ! errorMessage &&
            <svg className='container' ref={this.d3Container} />
        }
      </Chart>
    );
  }
}


const Chart = styled.div`
  height: 600px;
  width: 800px;
  min-height: 300px;
  min-width: 375px;
  background: #fafafa;

  svg {
    border: 1px solid coral;
    width: ${svgWidth}px;
    height: ${svgHeight}px;
  }
`;

const Error = styled.div`
  background: red;
  color: white;
  padding: 20px;
`;

const Tooltip = styled.div`
  height: 100px;
  width: 200px;
  border-radius: 6px;
  background: lightblue;
  color: white;
`;
