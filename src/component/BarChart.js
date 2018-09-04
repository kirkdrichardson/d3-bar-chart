import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

const svgWidth = 800;
const svgHeight = Math.round(svgWidth / (16/9));
const xTransformation = 10;
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
    // helper functions to parse year from string such as '1975-01-01'
    const matchYearMonthQuarter = dateTimeString => dateTimeString.match(/(^\d{4})-(\d{2})-(\d{2}$)/);
    const getYear = dateTimeString => matchYearMonthQuarter(dateTimeString)[1];
    const getQuarter = dateTimeString => matchYearMonthQuarter(dateTimeString)[3];

    const gdpArray = [],
          yearsArray = [];

    data.forEach(e => {
      gdpArray.push(e[1]);
      yearsArray.push(getYear(e[0]));
    });

    // get the min and max values for each scale (gdp on y and years on x)
    const minGdp = Math.min(...gdpArray),
          maxGdp = Math.max(...gdpArray),
          minYear = Math.min(...yearsArray),
          maxYear = Math.max(...yearsArray);

    // create a linear scale
    const yScale = d3.scaleLinear()
      .domain([0, maxGdp])
      .range([padding, svgHeight - padding]);

      // create a linear scale
    const yAxisScale = d3.scaleLinear()
      .domain([0, maxGdp])
      .range([svgHeight - padding, padding]);

    const xScale = d3.scaleLinear()
      .domain([0, (data.length - 1) * xTransformation])
      .range([padding, svgWidth - 20]);

    // tranform the original data into an array of objects containing scaled x, y properties
    const scaledData = data.map((e, i) =>
    ({
      x: xScale(i * xTransformation),
      y: yScale(e[1]),
      date: e[0],
      gdp: e[1],
      year: getYear(e[0]),
      quarter: getQuarter(e[0])
    }));

    const xAxisScale = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([padding, svgWidth - 20]);

    const xAxis = d3.axisBottom()
      .scale(xAxisScale)
      .tickFormat(d3.format('d'));


    const yAxis = d3.axisLeft(yAxisScale);

    // append rect elements
    d3.select(node)
      .selectAll("rect")
        .data(scaledData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('x', (d, i) => d.x)
        .attr('y', d => svgHeight - padding - d.y)
        .attr('height', d => d.y)
        // append a title tooltip with the gdp value to each rect
        .append('title')
        .text(d => `$${d.gdp.toFixed(1)} Billion
          ${d.year} Q${Number(d.quarter)}`);

      d3.select(node)
        .append('g')
        .attr("transform", `translate(0, ${(svgHeight - padding)})`)
        .call(xAxis);

      d3.select(node)
        .append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);
  }

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
  min-height: 300px;
  min-width: 375px;
  background: #fafafa;

  svg {
    width: ${svgWidth}px;
    height: ${svgHeight}px;
  }

  border: 1px solid coral;
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
