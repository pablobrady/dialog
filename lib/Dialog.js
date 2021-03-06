/** @jsx React.DOM */

var React = require('react');
var domAlign = require('dom-align');
var RcUtil = require('rc-util');
var Dom = RcUtil.Dom;
var assign = require('object-assign');

function prefixClsFn(prefixCls) {
  var args = Array.prototype.slice.call(arguments, 1);
  return args.map(function (s) {
    if (!s) {
      return prefixCls;
    }
    return prefixCls + '-' + s;
  }).join(' ');
}

function buffer(fn, ms) {
  var timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, ms);
  };
}

var Dialog = React.createClass({
  align() {
    var align = this.props.align;
    domAlign(React.findDOMNode(this.refs.dialog), align.node || window, align);
  },

  monitorWindowResize() {
    if (!this.resizeHandler) {
      this.resizeHandler = Dom.addEventListener(window, 'resize', buffer(this.align, 80));
    }
  },

  unMonitorWindowResize() {
    if (this.resizeHandler) {
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  },

  componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate() {
    var props = this.props;
    if (props.visible) {
      this.monitorWindowResize();
      // first show
      if (!this.lastVisible) {
        this.align();
        React.findDOMNode(this.refs.dialog).focus();
      } else {
        if (props.align !== this.lastAlign) {
          this.align();
        }
      }
    } else {
      this.unMonitorWindowResize();
    }
    this.lastVisible = props.visible;
    this.lastAlign = props.align;
  },

  componentWillUnmount() {
    this.unMonitorWindowResize();
  },

  render() {
    var props = this.props;
    var visible = props.visible;
    var prefixCls = props.prefixCls;
    var className = [prefixClsFn(prefixCls, 'wrap')];
    var closable = props.closable;
    if (!visible) {
      className.push(prefixClsFn(prefixCls, 'wrap-hidden'));
    }
    var dest = {};
    if (props.width !== undefined) {
      dest.width = props.width;
    }
    if (props.height !== undefined) {
      dest.height = props.height;
    }
    if (props.zIndex !== undefined) {
      dest.zIndex = props.zIndex;
    }

    var style = assign({}, props.style, dest);

    var maskProps = {};
    if (closable) {
      maskProps.onClick = this.props.onClose;
    }
    if (style.zIndex) {
      maskProps.style = {zIndex: style.zIndex};
    }
    return (<div className={className.join(' ')}>
    {props.mask !== false ? <div {...maskProps} className={prefixClsFn(prefixCls, 'mask')}/> : null}
      <div className={[prefixClsFn(prefixCls, ''), props.className].join(' ')} tabIndex="0" role="dialog" ref='dialog' style={style}>
        <div className={prefixClsFn(prefixCls, 'content')}>
          <div className={prefixClsFn(prefixCls, 'header')}>
            {closable ?
              (<a tabIndex="0" onClick={this.props.onClose} className={[prefixClsFn(prefixCls, 'close')].join('')}>
                <span className={prefixClsFn(prefixCls, 'close-x')}>×</span>
              </a>) :
              null}
            <div className={prefixClsFn(prefixCls, 'title')}>{props.title}</div>
          </div>
          <div className={prefixClsFn(prefixCls, 'body')}>{props.children}</div>
        </div>
      </div>
    </div>);
  }
});

module.exports = Dialog;
