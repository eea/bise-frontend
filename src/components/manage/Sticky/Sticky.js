import React, { Component } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Sticky extends Component {
  static defaultProps = {
    className: 'sticky-wrapper',
  };

  static contextTypes = {
    subscribeSticky: PropTypes.func,
    unsubscribeSticky: PropTypes.func,
    activeSticky: PropTypes.object,
    setActiveSticky: PropTypes.func,
    setInactiveSticky: PropTypes.func,
  };

  state = {
    id: uuid(),
    isSticky: false,
    isActive: false,
    style: {},
    wasSticky: false,
  };

  componentWillMount() {
    if (!this.context.subscribeSticky)
      throw new TypeError(
        'Expected Sticky to be mounted within StickyContainer',
      );

    this.context.subscribeSticky(this.handleContainerEvent);
  }

  componentWillUnmount() {
    this.context.unsubscribeSticky(this.handleContainerEvent);
    this.context.setInactiveSticky(this.state.id);
  }

  handleContainerEvent = ({ distanceFromTop }) => {
    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;
    const wasSticky = !!this.state.isSticky;
    const wasActive = !!this.state.isActive;
    const isSticky = placeholderClientRect.top < this.props.topOffset;
    const isActive = this.isActive();

    if (isSticky !== wasSticky) {
      if (isSticky) {
        this.context.setActiveSticky(
          this.state.id,
          distanceFromTop + placeholderClientRect.top,
        );
      } else {
        this.context.setInactiveSticky(this.state.id);
      }
      this.setState({
        isSticky,
        wasSticky,
        style: !isSticky
          ? {}
          : {
              position: 'fixed',
              top: 0,
              width: placeholderClientRect.width,
              opacity: 1,
              transition: 'opacity .2s',
            },
        calculatedHeight,
      });
    } else if (isActive !== wasActive) {
      this.setState({ isActive });
    } else if (
      isSticky &&
      this.state.style.width !== placeholderClientRect.width
    ) {
      this.setState({
        style: { ...this.state.style, width: placeholderClientRect.width },
      });
    }
  };

  isActive = () => {
    let MAX = -Infinity;
    let active = undefined;
    for (let sticky in this.context.activeSticky) {
      if (this.context.activeSticky[sticky] >= MAX) {
        MAX = this.context.activeSticky[sticky];
        active = sticky;
      }
    }

    return active === this.state.id;
  };

  render() {
    const children = this.props.children;
    const element = React.cloneElement(children, {
      ...children.props,
      isSticky: this.state.isSticky,
    });

    return (
      <div
        {...this.props}
        className={cx(this.props.className, { sticky: this.state.isSticky })}
      >
        <div
          style={{
            padding: 0,
            paddingBottom: `${
              this.state.isSticky ? this.state.calculatedHeight : 0
            }px`,
          }}
          className="sticky-placeholder"
          ref={(placeholder) => (this.placeholder = placeholder)}
        />
        <div
          className="sticky-content"
          ref={(content) => (this.content = content)}
          style={
            this.state.isSticky
              ? this.state.isActive
                ? this.state.style
                : { ...this.state.style, opacity: 0, zIndex: -1 }
              : {}
          }
        >
          {element}
        </div>
      </div>
    );
  }
}
