import React, { useState } from 'react';

import { AddEditEmployee } from './add-edit-employee';
import { EmployeeInfo, getEmployeeApi } from '../apis';

import './employee-list.css';

export type EmployeeListProps = {
  companyId: string;
  onEmployeeIdSelected: (employeeId: string) => void;
};

export const EmployeeList: React.FC<EmployeeListProps> = (props) => {
  const [employees, setEmployees] = useState<EmployeeInfo[]>([]);
  const [editItem, setEditItem] = useState<EmployeeInfo | undefined>(undefined);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EmployeeInfo | undefined>(undefined);

  const setSortedEmployees = (unsortedEmployees: EmployeeInfo[]): void => {
    const sortedEmployees = unsortedEmployees.sort((a, b) => {
      if (a.legalName.last !== b.legalName.last) {
        return a.legalName.last.localeCompare(b.legalName.last);
      } else {
        return a.legalName.first.localeCompare(b.legalName.first);
      }
    });
    setEmployees(sortedEmployees);
  }

  const refreshEmployees = React.useCallback((): void => {
    getEmployeeApi().getEmployees(props.companyId).then((employeeInfo) => {
      // setEmployees(employeeInfo);
      setSortedEmployees(employeeInfo);
    }).catch((reason) => {
      // TODO: Display error to the user in a toast message or some other alert.
    });
  }, [props.companyId]);

  React.useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  const dialogRef = React.createRef<HTMLDialogElement>();

  const handleAddEmployee = () => {
    setEditItem(undefined);
    setModalOpen(true);
    dialogRef.current?.showModal();
  };

  const handleEditEmployee = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: EmployeeInfo) => {
    event.stopPropagation();
    setEditItem(item);
    setModalOpen(true);
    dialogRef.current?.showModal();
  }

  const handleRemoveEmployee = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: EmployeeInfo) => {
    event.stopPropagation();

    if (item.employeeId === selectedItem?.employeeId) {
      setSelectedItem(undefined);
      props.onEmployeeIdSelected('');
    }

    getEmployeeApi().removeEmployee(props.companyId, item).then(() => {
      refreshEmployees();
    }).catch((reason) => {
      // TODO: Display error to the user in a toast message or some other alert.
    });
  };

  const handleAddOrEditOK = (info: EmployeeInfo) => {
    setModalOpen(false);
    dialogRef.current?.close();

    getEmployeeApi().addOrUpdateEmployee(props.companyId, info).then(() => {
      refreshEmployees();
    }).catch((reason) => {
      // TODO: Display error to the user in a toast message or some other alert.
    });
  }

  const handleAddOrEditCancel = () => {
    setModalOpen(false);
    dialogRef.current?.close();
  }

  const handleEmployeeClick = (item: EmployeeInfo) => {
    setSelectedItem(item);
    props.onEmployeeIdSelected(item.employeeId);
  }

  return (
    <div>
      <dialog ref={dialogRef}>
        {isModalOpen && <AddEditEmployee info={editItem} onCancel={handleAddOrEditCancel} onOK={handleAddOrEditOK}/>}
      </dialog>
      <h2>Employee List</h2>
      <div className="employee-add-button">
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
      <div className="employee-table-parent">
        <table className="employee-table">
          {employees.map((employeeInfo) => (
            <tr key={employeeInfo.employeeId} onClick={() => handleEmployeeClick(employeeInfo)}>
              <td className={selectedItem?.employeeId === employeeInfo.employeeId ? "selected" : ""}>
                {employeeInfo.legalName.last + ', ' + employeeInfo.legalName.first}
              </td>
              <td className={selectedItem?.employeeId === employeeInfo.employeeId ? "selected" : ""}>
                <button onClick={(event) => handleEditEmployee(event, employeeInfo)}>Edit</button>
                <button onClick={(event) => handleRemoveEmployee(event, employeeInfo)}>Remove</button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
