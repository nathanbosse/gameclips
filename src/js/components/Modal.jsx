'use strict';

import React, { PropTypes } from 'react';
import Icon from './Icon';
import UIButton from './UIButton';


const Modal = React.createClass({

    propTypes: {
        hideModal: PropTypes.func.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    },

    getDefaultProps() {
        return {
            hideModal: () => {},
            children: null
        };
    },

    componentDidMount() {
        // allow esc to close modal
        document.addEventListener('keyup', this.onKeyUp);
    },

    componentWillUnmount() {
        document.removeEventListener('keyup', this.onKeyUp);
    },

    onKeyUp(e) {
        // esc key closes modal
        if (e.keyCode === 27) {
            this.props.hideModal();
        }
    },

    render() {
        const { hideModal, children } = this.props;

        return (
            <div className="modal-overlay" onClick={ hideModal }>
                <div className="modal-inner" onClick={ (e) => e.stopPropagation() }>
                    <a href="#" onClick={ hideModal } className="modal-close">
                      <UIButton
                        type="primary"
                        materialIcon="close"
                        className="grey"
                        tooltip="Hide Modal">
                      </UIButton>
                    </a>
                    { children }
                </div>
            </div>
        );
    }
});

export default Modal;
