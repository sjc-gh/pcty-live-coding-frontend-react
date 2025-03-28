import React, { useState } from 'react';

import { AddEditDependent } from './add-edit-dependent';
import { DependentInfo, DependentType, getEmployeeApi } from '../apis';

import _ from 'lodash';

import './dependent-list.css';

export type DependentListProps = {
  companyId: string;
  employeeId: string;
};

export const DependentList: React.FC<DependentListProps> = (props) => {
  const [dependents, setDependents] = useState<DependentInfo[]>([]);
  const [packageId, setPackageId] = useState('');
  const [totalCost, setTotalCost] = useState(0.0);
  const [editItem, setEditItem] = useState<DependentInfo | undefined>(undefined);
  const [isModalOpen, setModalOpen] = useState(false);

  // NOTE:
  // Use this mechanism to format the total cost in different currencies and languages.
  // Default to USD.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const setSortedDependents = (unsortedDependents: DependentInfo[]): void => {
    const sortedDependents = unsortedDependents.sort((a, b) => {
      const typeOrder = {
        [DependentType.Self]: 1,
        [DependentType.Spouse]: 2,
        [DependentType.Child]: 3,
        [DependentType.Unknown]: 4
      };

      const typeCompare = (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0);
      if (typeCompare === 0) {
        // Within the same type ( theoretically Self should have a count of 1, Spouse should have
        // a count of 0 or 1, and Unknown should have a count of 0.

        // NOTE: For simplicity, just compare first names.
        return a.legalName.first.localeCompare(b.legalName.first);
      } else {
        return typeCompare;
      }
    });
    setDependents(sortedDependents);
  };

  const refreshDependents = React.useCallback((): void => {
    getEmployeeApi().getBenefitsInfo(props.companyId, props.employeeId).then((benefitsInfo) => {
      setPackageId(benefitsInfo.packageId);
      setSortedDependents(benefitsInfo.dependents);
    }).catch((reason) => {
      // TODO: Display error to the user in a toast message or some other alert.
    });
  }, [props.companyId, props.employeeId]);

  const refreshTotalCost = React.useCallback((): void => {
    getEmployeeApi().calculateBenefitsCost(props.companyId, packageId, dependents).then((value) => {
      setTotalCost(value);
    }).then((reason) => {
      // TODO: Display error to the user in a toast message or some other alert.
    });
  }, [props.companyId, packageId, dependents]);

  React.useEffect(() => {
    refreshDependents();
  }, [refreshDependents]);

  React.useEffect(() => {
    refreshTotalCost();
  }, [refreshTotalCost]);

  const dialogRef = React.createRef<HTMLDialogElement>();

  const handleAddDependent = () => {
    setEditItem(undefined);
    setModalOpen(true);
    dialogRef.current?.showModal();
  };

  const handleEditDependent = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: DependentInfo) => {
    event.stopPropagation();
    setEditItem(item);
    setModalOpen(true);
    dialogRef.current?.showModal();
  }

  const handleRemoveDependent = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: DependentInfo) => {
    event.stopPropagation();
    setDependents(dependents.filter((dependent) => dependent.dependentId !== item.dependentId));
  };

  const handleAddOrEditOK = (info: DependentInfo) => {
    // TODO:
    // Need to do validation:
    // * Cannot add more than one 'self'.
    // * Cannot add more than one 'spouse' ( maybe, depending on the locale if its legal ).
    // * Cannot add a dependeng with 'unknown' relationship.
    // * If cost of all dependents exceeds the paycheck, then need to throw an error.

    setModalOpen(false);
    dialogRef.current?.close();

    const newDependents = _.cloneDeep(dependents);
    const result = newDependents.find((dependent) => dependent.dependentId === info.dependentId);
    if (result) {
      result.legalName = { ...info.legalName };
      result.type = info.type;
    } else {
      newDependents.push(info);
    }

    setSortedDependents(newDependents);
  };

  const handleSave = (): void => {
    getEmployeeApi().updateBenefitsInfo(props.companyId, props.employeeId, {
      dependents: dependents,
      packageId: packageId,
    }).then(() => {
      refreshDependents();
    }).catch((reason) => {
      // TODO: Display error to the user in a toast message or some other alert.
    });
  };

  const handleAddOrEditCancel = () => {
    setModalOpen(false);
    dialogRef.current?.close();
  };

  return (
    <div>
      <dialog ref={dialogRef}>
        {isModalOpen && <AddEditDependent info={editItem} onCancel={handleAddOrEditCancel} onOK={handleAddOrEditOK}/>}
      </dialog>
      <h2>Dependent List</h2>
      <div className="dependent-add-button">
        <button onClick={handleAddDependent}>Add Dependent</button>
      </div>
      <div className="dependent-table-parent">
        <table className="dependent-table">
          <tr>
            <th>Legal Name</th>
            <th>Relationship</th>
            <th></th>
          </tr>
          {dependents.map((dependentInfo) => (
            <tr key={dependentInfo.dependentId}>
              <td>
                {dependentInfo.legalName.first + " " + dependentInfo.legalName.last}
              </td>
              <td>
                {dependentInfo.type}
              </td>
              <td>
                <button onClick={(event) => handleEditDependent(event, dependentInfo)}>Edit</button>
                <button onClick={(event) => handleRemoveDependent(event, dependentInfo)}>Remove</button>
              </td>
            </tr>
          ))}
        </table>
      </div>
      <div>
        <div className="cost-per-paycheck">
          { "Total cost per paycheck: " + formatter.format(totalCost) }
        </div>
        <div className="save-dependents">
          <button type="button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
