/**
 * CgTextEllipsis Component for fusion
 * @author ZhangYuying
 *
 */
import React, { PropTypes } from 'react'
import HmToolTip from './hmToolTip'
import Clamp from './clamp'

class HmTextEllipsis extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOver: false,
      clamped: ''
    }
  }

  componentWillMount () {}

  componentDidMount () {
    const element = document.getElementById(this.props.uniqueKey)
    const clampInfo = Clamp(element, {
      line: this.props.line,
      ellipsisChar: this.props.ellipsisChar
    })
    if (this.state.isOver !== clampInfo.isOver) {
      this.setState({
        isOver: clampInfo.isOver,
        clamped: clampInfo.clamped
      })
    }
  }

  render () {
    const { isOver, clamped } = this.state
    const { maxTipWidth, tipAlign, tipTextAlign, isTipAlwaysShow } = this.props
    const displayValue = (<div style={{ maxWidth: `${maxTipWidth}px`, textAlign: tipTextAlign }}>
      {this.props.text}
    </div>)

    if (!isOver) {
      if (isTipAlwaysShow) {
        return (
          <HmToolTip displayValue={displayValue} placement={tipAlign}>
            <div id={this.props.uniqueKey}>{this.props.text}</div>
          </HmToolTip>
        )
      }
      return (
        <div id={this.props.uniqueKey} className='text-ellipsis'>
          {this.props.text}
        </div>
      )
    }
    return (
      <HmToolTip displayValue={displayValue} placement={tipAlign}>
        <div id={this.props.uniqueKey}>{clamped}</div>
      </HmToolTip>
    )
  }
}

HmTextEllipsis.displayName = 'HmTextEllipsis'
HmTextEllipsis.propTypes = {
  line: PropTypes.number,
  ellipsisChar: PropTypes.string,
  text: PropTypes.string.isRequired,
  uniqueKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  maxTipWidth: PropTypes.number,
  tipAlign: PropTypes.oneOf(['left', 'right', 'top', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
  tipTextAlign: PropTypes.oneOf(['left', 'center', 'right']),
  isTipAlwaysShow: PropTypes.bool
}

HmTextEllipsis.defaultProps = {
  line: 1,
  ellipsisChar: '…',
  maxTipWidth: 400,
  tipAlign: 'topRight',
  tipTextAlign: 'left',
  isTipAlwaysShow: false
}

export default HmTextEllipsis
