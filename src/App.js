import React, { Component } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
// window.d3 = d3;

const svgHeight = 600;
const svgWidth = 800;
const padding = 60;

const barWidth = 10;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      payload: null,
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
          this.feedD3Container(payload.data);
          this.setState({
            fetching: false,
            payload
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

  feedD3Container = (dataset) => {
    const node = this.d3Container.current;

    // get the min and max GDP
    const min = d3.min(dataset, d => d[1])
    const max = d3.max(dataset, d => d[1])

    // create a linear scale
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([svgHeight - padding, padding]);

    const xScale = d3.scaleLinear()
      .domain([0, (dataset.length - 1) * 10])
      .range([padding, svgWidth - padding]);

    // append rect elements
    d3.select(node)
      .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('x', (d, i) => xScale(i * 10))
        .attr('y', d => svgHeight - (padding + yScale(d[1])))
        .attr('height', d => yScale((d[1])))
        // .style("height", (d) => ((600 - Math.round(d[1] / 50)) + "px"))

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
      //     .data(dataset)
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
      payload
    } = this.state;

    return (
      <AppContainer>
        <ChartContainer>
          <h2>US GDP</h2>
          <Chart>
            { /* TODO - replace with spinner */}
            { fetching && <span style={{color: 'black'}}>'loading...'</span> }
            { errorMessage && <Error>{ errorMessage }</Error> }

              <svg className='container' ref={this.d3Container} />
          </Chart>
        </ChartContainer>
      </AppContainer>
    );
  }
}


const AppContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartContainer = styled.div`
  padding: 20px 40px;
  background: gray;
`;

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
