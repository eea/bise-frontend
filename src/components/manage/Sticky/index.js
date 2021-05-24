import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import raf from 'raf';
import Sticky from './Sticky';

export { Sticky };

export class StickyProvider extends PureComponent {
  static childContextTypes = {
    subscribeSticky: PropTypes.func,
    unsubscribeSticky: PropTypes.func,
    activeSticky: PropTypes.object,
    setActiveSticky: PropTypes.func,
    setInactiveSticky: PropTypes.func,
  };

  getChildContext() {
    return {
      subscribeSticky: this.subscribe,
      unsubscribeSticky: this.unsubscribe,
      activeSticky: this.activeList,
      setActiveSticky: this.setActive,
      setInactiveSticky: this.setInactive,
    };
  }

  events = [
    'resize',
    'scroll',
    'touchstart',
    'touchmove',
    'touchend',
    'pageshow',
    'load',
  ];

  subscribers = [];

  activeList = {};

  rafHandle = null;

  subscribe = (handler) => {
    this.subscribers = this.subscribers.concat(handler);
  };

  unsubscribe = (handler) => {
    this.subscribers = this.subscribers.filter(
      (current) => current !== handler,
    );
  };

  getActive = () => {
    let MAX = -Infinity;
    let active = undefined;
    for (let sticky in this.activeList) {
      if (this.activeList[sticky] > MAX) {
        MAX = this.activeList[sticky];
        active = sticky;
      }
    }
    return active;
  };

  setActive = (id, top) => {
    if (!this.activeList[id]) {
      this.activeList[id] = top;
    }
  };

  setInactive = (id) => {
    if (this.activeList[id]) {
      delete this.activeList[id];
    }
  };

  notifySubscribers = () => {
    if (!this.framePending) {
      this.rafHandle = raf(() => {
        this.framePending = false;
        const top = window.pageYOffset;
        const bottom = document.body.scrollHeight;

        this.subscribers.forEach((handler) =>
          handler({
            distanceFromTop: top,
            distanceFromBottom: bottom,
          }),
        );
      });
      this.framePending = true;
    }
  };

  componentDidMount() {
    this.events.forEach((event) =>
      window.addEventListener(event, this.notifySubscribers),
    );
  }

  componentWillUnmount() {
    if (this.rafHandle) {
      raf.cancel(this.rafHandle);
      this.rafHandle = null;
    }

    this.events.forEach((event) =>
      window.removeEventListener(event, this.notifySubscribers),
    );
  }

  render() {
    return this.props.children;
  }
}
