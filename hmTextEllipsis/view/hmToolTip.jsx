
import React from 'react'
import Tooltip from './tooltip'

const HmToolTip = ({ displayValue, children, ...otherProps }) => (
  <Tooltip placement={'topLeft'} overlay={displayValue} {...otherProps}>
    {children}
  </Tooltip>
)

HmToolTip.propTypes = {
  displayValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element
  ]),
  children: React.PropTypes.element
}

export default HmToolTip
