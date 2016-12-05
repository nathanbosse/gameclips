'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';

import Actions from '../actions/Actions';
import abbreviateNumber from '../util/abbreviateNumber';
import Icon from './Icon';
const IconButton = require('material-ui/lib/icon-button');
const FontIcon = require('material-ui/lib/font-icon');

const UIButton = React.createClass({

  propTypes: {
    className: PropTypes.string,
    materialIcon: PropTypes.string,
    tooltip: PropTypes.string,
    type: PropTypes.string
  },

  getInitialState() {
    return {};
  },

  componentWillReceiveProps(nextProps) {},

  render(node) {
    const {className, materialIcon} = this.props;
    const tooltip = this.props.tooltip;
    const classNames = 'material-icons ' + className;

    return <IconButton iconClassName={classNames} tooltipPosition="bottom-center" tooltip={tooltip}>{materialIcon}</IconButton>;

  }

});

// Sample Code
// <UIButton
//   type="primary"
//   materialIcon="add"
//   className="primary"
//   tooltip="new post">
// </UIButton>

export default UIButton;
