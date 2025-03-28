import React, { useState } from 'react';
import { EmployeeInfo } from '../apis';
import { v6 as uuidv6 } from 'uuid';
import _ from 'lodash';

import './add-edit-employee.css';

export type AddEditEmployeeProps = {
  info: EmployeeInfo | undefined;
  onCancel: () => void;
  onOK: (info: EmployeeInfo) => void;
};

export const AddEditEmployee: React.FC<AddEditEmployeeProps> = (props) => {
  const [formData, setFormData] = useState<EmployeeInfo>({
    employeeId: props.info?.employeeId ?? uuidv6(), 
    legalName: {
      prefix: props.info?.legalName.prefix,
      first: props.info?.legalName.first ?? '',
      middle: props.info?.legalName.middle,
      last: props.info?.legalName.last ?? '',
      suffix: props.info?.legalName.suffix,
    },
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setFormData(prevState => {
      const newState = _.cloneDeep(prevState);
      switch (name) {
        case 'prefix': 
          newState.legalName.prefix = value;
          break;
        case 'first': 
          newState.legalName.first = value;
          break;
        case 'middle': 
          newState.legalName.middle = value;
          break;
        case 'last': 
          newState.legalName.last = value;
          break;
        case 'suffix': 
          newState.legalName.suffix = value;
          break;
      }
      return newState;
    });
  };

  const handleCancel: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    props.onCancel();
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.onOK(formData);
  };

  return (
    <div>
      <h3 className="add-edit-employee-header">{props.info?.employeeId ? "Edit Employee" : "Add Employee"}</h3>
      <form className="add-edit-employee-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="employee-prefix">Prefix:</label>
          <input
            type="text"
            id="employee-prefix"
            name="prefix"
            value={formData.legalName.prefix}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="employee-first">First name:</label>
          <input
            type="text"
            id="employee-first"
            name="first"
            value={formData.legalName.first}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="employee-middle">Middle name:</label>
          <input
            type="text"
            id="employee-middle"
            name="middle"
            value={formData.legalName.middle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="employee-last">Last name:</label>
          <input
            type="text"
            id="employee-last"
            name="last"
            value={formData.legalName.last}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="employee-suffix">Suffix:</label>
          <input
            type="text"
            id="employee-suffix"
            name="suffix"
            value={formData.legalName.suffix}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit">OK</button>
        </div>
      </form>
    </div>
  );
}
