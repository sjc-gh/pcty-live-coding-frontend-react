import React from 'react';

import './App.css';

import { getDemoCompanyId } from './apis';
import { DependentList } from './components/dependent-list';
import { EmployeeList } from './components/employee-list';

function App() {
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState('');

  const handleEmployeeIdSelected = (employeeId: string): void => {
    setSelectedEmployeeId(employeeId);
  };

  // NOTE:
  // For demo purposes, there is only one company id in the system.
  const companyId = getDemoCompanyId();

  return (
    <div className="app-parent">
      <div className="app-child-list">
        <EmployeeList companyId={companyId} onEmployeeIdSelected={handleEmployeeIdSelected} />
      </div>
      <div className="app-child-list" style={{ visibility: selectedEmployeeId ? 'visible' : 'hidden' }}>
        <DependentList companyId={companyId} employeeId={selectedEmployeeId}/>
      </div>
    </div>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">, 
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>

  //     <DependentsList dependents={benefitsInfo.dependents} />

  //     {benefitsInfo.dependents.length > 0 && <AddEditDependent info={benefitsInfo.dependents[0]} onOk={onAddEdit}/>}
  //   </div>
  // );
}

export default App;
