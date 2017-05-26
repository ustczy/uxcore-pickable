/**
 * Pickable Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const classnames = require('classnames');
const React = require('react');
const Icon = require('uxcore-icon');
const addEventListener = require('rc-util/lib/Dom/addEventListener');
const Item = require('./PickItem');
const i18n = require('./locale');


class Pickable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToggle: false,
      foldItems: props.defaultfoldItems,
    };
    this.adjustToggleMore = this.adjustToggleMore.bind(this);
  }


  componentDidMount() {
    if (this.props.enableFold) {
      this.adjustToggleMore();
      this.toggleListener = addEventListener(window, 'resize', this.adjustToggleMore);
    }
  }

  componentDidUpdate() {
    if (this.props.enableFold) {
      this.adjustToggleMore();
    }
  }

  adjustToggleMore() {
    if (!this.props.enableFold) {
      return;
    }
    if (this.rootWidth && this.rootWidth === parseInt(this.root.clientWidth, 10)) {
      return;
    }
    const itemsInner = this.itemsInner;
    this.rootWidth = this.root.clientWidth;
    if (itemsInner && itemsInner.clientHeight >= 40 * this.props.maxLines) {
      this.setState({
        showToggle: true,
      });
    } else {
      this.setState({
        showToggle: false,
      });
    }
  }

  handleItemClick(value) {
    const me = this;
    const values = me.props.value.slice(0);
    const index = values.indexOf(value);
    if (!me.props.multiple) {
      me.props.onChange([value], value);
      return;
    }
    if (index !== -1) {
      values.splice(index, 1);
      me.props.onChange(values, value);
    } else {
      values.push(value);
      me.props.onChange(values, value);
    }
  }

  handleToggleClick() {
    this.setState({
      foldItems: !this.state.foldItems,
    });
  }

  renderChildren() {
    const me = this;
    const state = this.state;
    const { prefixCls, type, children, value, max, multiple, maxLines } = me.props;
    const rendered = React.Children.map(children, child => React.cloneElement(child, {
      active: value.indexOf(child.props.value) !== -1,
      prefixCls: `${prefixCls}-item`,
      multiple,
      type,
      jsxmax: max,
      onClick: me.handleItemClick.bind(me),
    }));
    const itemsStyle = {};
    if (state.showToggle && state.foldItems) {
      itemsStyle.height = 36 * maxLines;
    }
    return (
      <div
        className={classnames(`${prefixCls}-items`, {
          [`${prefixCls}-items__fold`]: state.showToggle && state.foldItems,
        })}
        style={itemsStyle}
      >
        <div className={`${prefixCls}-items-inner`} ref={(c) => { this.itemsInner = c; }}>
          {rendered}
        </div>
      </div>
    );
  }

  renderToggleMore() {
    if (!this.state.showToggle) {
      return null;
    }
    const { prefixCls, locale } = this.props;
    return (
      <div
        className={classnames(`${prefixCls}-toggle-more`, {
          [`${prefixCls}-toggle-more__fold`]: this.state.foldItems,
        })}
        onClick={() => {
          this.handleToggleClick();
        }}
      >
        {i18n[locale][!this.state.foldItems ? 'fold' : 'unfold']}
        <Icon name="bottom" className={`${prefixCls}-toggle-more-icon`} />
      </div>
    );
  }

  render() {
    const me = this;
    const { prefixCls, className, locale } = me.props;
    return (
      <div
        className={classnames({
          [`${prefixCls}`]: true,
          [className]: !!className,
          [`${prefixCls}-en`]: locale === 'en-us',
        })}
        ref={(c) => { this.root = c; }}
      >
        {me.renderChildren()}
        {me.renderToggleMore()}
      </div>
    );
  }
}

Pickable.defaultProps = {
  prefixCls: 'kuma-pickable',
  value: [],
  type: 'normal',
  multiple: true,
  enableFold: false,
  defaultfoldItems: true,
  locale: 'zh-cn',
  onChange: () => {
  },
  maxLines: 1,
};

// http://facebook.github.io/react/docs/reusable-components.html
Pickable.propTypes = {
  prefixCls: React.PropTypes.string,
  className: React.PropTypes.string,
  locale: React.PropTypes.string,
  value: React.PropTypes.array,
  multiple: React.PropTypes.bool,
  enableFold: React.PropTypes.bool,
  defaultfoldItems: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  type: React.PropTypes.oneOf(['normal', 'simple', 'hook', 'simpleHook']),
  max: React.PropTypes.number,
  maxLines: React.PropTypes.number,
};

Pickable.displayName = 'Pickable';

Pickable.Item = Item;

module.exports = Pickable;
