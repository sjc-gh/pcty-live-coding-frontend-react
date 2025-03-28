import React, { useState } from 'react';
import { DependentInfo, DependentType } from '../apis';
import { v6 as uuidv6 } from 'uuid';
import _ from 'lodash';

import './add-edit-dependent.css';

export type AddEditDependentProps = {
  info: DependentInfo | undefined;
  onCancel: () => void;
  onOK: (info: DependentInfo) => void;
};

export const AddEditDependent: React.FC<AddEditDependentProps> = (props) => {
  const [formData, setFormData] = useState<DependentInfo>({
    dependentId: props.info?.dependentId ?? uuidv6(), 
    legalName: {
      prefix: props.info?.legalName.prefix,
      first: props.info?.legalName.first ?? '',
      middle: props.info?.legalName.middle,
      last: props.info?.legalName.last ?? '',
      suffix: props.info?.legalName.suffix,
    },
    type: props.info?.type ?? DependentType.Unknown,
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

  const handleTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { value } = event.target;

    setFormData(prevState => {
      const newState = _.cloneDeep(prevState);
      newState.type = value as DependentType;
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
      <h3 className="add-edit-dependent-header">{props.info?.dependentId ? "Edit Dependent" : "Add Dependent"}</h3>
      <form className="add-edit-dependent-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dependent-prefix">Prefix:</label>
          <input
            type="text"
            id="dependent-prefix"
            name="prefix"
            value={formData.legalName.prefix}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dependent-first">First name:</label>
          <input
            type="text"
            id="dependent-first"
            name="first"
            value={formData.legalName.first}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dependent-middle">Middle name:</label>
          <input
            type="text"
            id="dependent-middle"
            name="middle"
            value={formData.legalName.middle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dependent-last">Last name:</label>
          <input
            type="text"
            id="dependent-last"
            name="last"
            value={formData.legalName.last}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dependent-suffix">Suffix:</label>
          <input
            type="text"
            id="dependent-suffix"
            name="suffix"
            value={formData.legalName.suffix}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dependent-type">Relantionship:</label>
          <select id="dependent-type" value={formData.type} onChange={handleTypeChange}>
            <option value={DependentType.Unknown}>Select...</option>
            <option value={DependentType.Self}>Self</option>
            <option value={DependentType.Spouse}>Spouse</option>
            <option value={DependentType.Child}>Child</option>
          </select>
        </div>
        <div>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit">OK</button>
        </div>
      </form>
    </div>
  );
}
