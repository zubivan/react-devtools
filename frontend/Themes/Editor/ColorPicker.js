/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const React = require('react');
const {findDOMNode} = require('react-dom');
const {CustomPicker} = require('react-color');
const {Hue, Saturation} = require('react-color/lib/components/common');

import type {Theme} from '../../types';

type Props = {
  color: string,
  hide: () => void,
  isOpen: boolean,
  theme: Theme,
  updateColor: (color: string) => void,
};

class ColorPicker extends React.Component {
  props: Props;

  _ref: any;

  componentDidMount() {
    document.addEventListener('keydown', this._onDocumentKeyDown);
    document.addEventListener('click', this._onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    document.removeEventListener('click', this._onDocumentClick);
  }

  render() {
    const {color, isOpen, theme} = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <DecoratedCustomColorPicker
        color={color}
        disableAlpha={true}
        onChangeComplete={this._onChangeComplete}
        ref={this._setRef}
        theme={theme}
      />
    );
  }

  // $FlowFixMe ^ class property `_onChangeComplete`. Missing annotation
  _onChangeComplete = (color) => {
    this.props.updateColor(color.hex);
  };

  // $FlowFixMe ^ class property `_onClose`. Missing annotation
  _onClose = () => {
    this.props.hide();
  };

  // $FlowFixMe ^ class property `_onDocumentClick`. Missing annotation
  _onDocumentClick = (event: Event) => {
    if (this._ref) {
      const node = findDOMNode(this._ref);
      if (node.contains(event.target)) {
        event.stopPropagation();
        return;
      }
    }

    this.props.hide();
  };

  // $FlowFixMe ^ class property `_onDocumentKeyDown`. Missing annotation
  _onDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.props.hide();
    }
  };

  // $FlowFixMe ^ class property `_setRef`. Missing annotation
  _setRef = (ref) => {
    this._ref = ref;
  };
}

class CustomColorPicker extends React.Component {
  render() {
    return (
      <div style={customColorPicker(this.props.theme)}>
        <div style={styles.saturation}>
          <Saturation
            {...this.props}
            onChange={this.props.onChange}
            pointer={CustomPointer}
          />
        </div>
        <div style={styles.hue}>
          <Hue
            {...this.props}
            direction="vertical"
            onChange={this.props.onChange}
            pointer={CustomPointer}
          />
        </div>
      </div>
    );
  }
}

const CustomPointer = () => (
  <div style={styles.pointer}></div>
);

const DecoratedCustomColorPicker = CustomPicker(CustomColorPicker);

const customColorPicker = (theme) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '0.125rem',
  borderRadius: '0.25rem',
  position: 'relative',
  zIndex: 1,
  background: theme.base00,
  border: `1px solid ${theme.base03}`,
});

const styles = {
  saturation: {
    flex: '0 0 auto',
    position: 'relative',
    width: '6rem',
    height: '6rem',
  },
  hue: {
    flex: '1 0 auto',
    position: 'relative',
    width: '0.75rem',
    height: '6rem',
    marginLeft: '0.125rem',
  },
  pointer: {
    width: '0.25rem',
    height: '0.25rem',
    borderRadius: '50%',
    transform: 'translate(-0.125rem, -0.125rem)',
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1.5px, rgba(0, 0, 0, 0.3) 0px 0px 1px 1px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 2px',
  },
};

module.exports = ColorPicker;
