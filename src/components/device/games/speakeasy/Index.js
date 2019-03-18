


import React, {Component} from 'react';

import SelectLocation from './SelectLocation';

import Ad from '../../Ad';

import {requests} from '../../../../actions/requestTypes';

export default class Speakeasy extends Component {

  render() {
    const {type} = this.props.request;
    switch (type) {
      case requests.speakeasy.newLocation:
        return <SelectLocation {...this.props} />
      default:
        return <Ad />
    }
  }
}
