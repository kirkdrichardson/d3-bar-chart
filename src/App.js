import React, { Component } from 'react';
import styled from 'styled-components';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      payload: null,
      errorMessage: null
    }
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
          this.setState({
            fetching: false,
            payload
          });
        }
      })
      .catch((err) => {
        console.error(err)
        this.setState({ errorMessage: 'Failed to load GDP data' });
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


  render() {
    const {
      errorMessage,
      fetching
    } = this.state;

    return (
      <AppContainer>
        <ChartContainer>
          <h2>US GDP</h2>
          <Chart>
            { /* TODO - replace with spinner */}
            { fetching && <span style={{color: 'black'}}>'loading...'</span> }
            { errorMessage && <Error>{ errorMessage }</Error> }
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
`;

const Error = styled.div`
  background: red;
  color: white;
  padding: 20px;
`;
