/***************************************************************************************
* Copyright 2018 Adobe. All rights reserved.
* This file is licensed to you under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License. You may obtain a copy
* of the License at http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under
* the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
* OF ANY KIND, either express or implied. See the License for the specific language
* governing permissions and limitations under the License.
***************************************************************************************/

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
  Checkbox
} from 'react-bootstrap';

const openDataElementSelector = input => () => {
  window.extensionBridge.openDataElementSelector(dataElement => input.onChange(dataElement));
};

function Item(value, desc) {
  return { value, desc };
}

const renderSelect = ({ input, options, ...prop }) => {
  const onInputRef = ((ref) => {
    if (ref) {
      ref.value = input.value;
    }
  });

  const children = options.map(option => (
    <option
      key={ option.value }
      value={ option.value }
    >
      {option.desc}
    </option>
  ));

  return (
    <FormGroup>
      <InputGroup>
        <FormControl
          componentClass="select"
          inputRef={ onInputRef }
          { ...input }
          { ...prop }
        >
          {children}
        </FormControl>
      </InputGroup>
    </FormGroup>
  );
};

const renderRadio = ({ input, options, ...prop }) => {
  const doNothing = () => {};
  const children = options.map(option => (
    <Radio
      key={ option.value }
      value={ option.value }
      onChange={ doNothing }
      checked={ input.value === option.value }
    >
      {option.desc}
    </Radio>
  ));

  return (
    <FormGroup>
      <InputGroup
        { ...input }
        { ...prop }
      >
        {children}
      </InputGroup>
    </FormGroup>
  );
};

const renderTextField = ({
  input, supportDataElement, meta: { touched, error }, ...prop
}) => (
  <FormGroup validationState={ error && touched ? 'error' : null }>
    <InputGroup>
      <FormControl
        type="text"
        value={ input.value }
        { ...input }
        { ...prop }
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
);

const renderCheckbox = ({ input }) => (
  <FormGroup>
    <Checkbox
      checked={ !!input.value }
      { ...input }
    />
  </FormGroup>
);

export { Item, renderSelect, renderRadio, renderTextField, renderCheckbox };
export { Row, Col, Form, FormGroup, ControlLabel, Panel, HelpBlock };
