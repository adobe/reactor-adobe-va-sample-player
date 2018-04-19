import React from 'react';

import {
    Col,
    Row,
    Form,
    FormControl,
    FormGroup,
    InputGroup,
    ControlLabel,
    Radio,
    Glyphicon,
    HelpBlock,
    Panel,
    Checkbox,
    Button
} from 'react-bootstrap';

const openDataElementSelector = (input) => () => window.extensionBridge.openDataElementSelector(
  dataElement => input.onChange(dataElement)
);

const openCodeEditor = (input, options) => () => window.extensionBridge.openCodeEditor(
    code => input.onChange(code) ,
    options
  );

function Item(value, desc) {
    return {value, desc};
}

const renderSelect = ({input, options, ...prop }) => {
    const onInputRef = ((ref) => {
        if (ref) {
            ref.value = input.value
        }
    })

    const children = options.map((option, idx) => {
        return (
            <option key={idx} value={option.value}> {option.desc} </option>
        )
    })

    return(
        <FormGroup>
            <InputGroup>
                <FormControl
                    componentClass='select'
                    inputRef={onInputRef}
                    {...input}
                    {...prop}
                >
                    {children}
                </FormControl>
            </InputGroup>
        </FormGroup>
    )
}

const renderRadio = ({input, options, ...prop}) => {
    const doNothing = () => {};
    const children = options.map((option, idx) => {
        return (
            <Radio key={idx} value={option.value} onChange={doNothing} checked={input.value === option.value}> {option.desc} </Radio>
        )
    })

    return(
        <FormGroup>
            <InputGroup            
                {...input}
                {...prop}
            >
                {children}
            </InputGroup>
        </FormGroup>
    )
}

const renderTextField = ({input, supportDataElement,meta : {touched, error}, ...prop}) => (
        <FormGroup validationState={error && touched ? 'error' : null}>
            <InputGroup>
                <FormControl
                    type="text"
                    value={input.value}
                    {...input}
                    {...prop}
                />
                {
                    supportDataElement &&
                    <InputGroup.Addon>
                        <Glyphicon glyph="menu-hamburger" onClick={ openDataElementSelector(input) } /> 
                    </InputGroup.Addon>
                }
            </InputGroup>
            {
                error && touched && <HelpBlock>{error}</HelpBlock>
            }
        </FormGroup>
)

const renderCheckbox = ({ input }) => (
    <FormGroup>
    <Checkbox
      checked={input.value ? true : false}
      {...input}
    />
     </FormGroup>
);

export {Item, renderSelect, renderRadio, renderTextField, renderCheckbox};
export {Row, Col, Form, FormGroup, ControlLabel, Panel, HelpBlock};