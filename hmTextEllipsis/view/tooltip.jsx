/**
 * CgTextEllipsis Component for fusion
 * @author ZhangYuying
 *
 */


import RcTooltip from 'rc-tooltip';
import './toolTips.scss'

export default class Tooltip extends RcTooltip {
    static displayName = 'hm-tooltip'
    static propTypes = {
        ...RcTooltip.propTypes,
    }
    static defaultProps = {
        ...RcTooltip.defaultProps,
        prefixCls: 'hm-tooltip',
        transitionName: 'tip-slide',
    }
}