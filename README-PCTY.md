## Running the application

1. Download the source.
2. Execute 'npm install'.
3. Execute 'npm run build'.
4. Execute 'npm run start'.
5. Navigate on a browser to http://localhost:3000/.

## Navigating the application

* The app contains two panels, and Employee List on the left and a Dependent List on the right.
* The Dependent List does not render until an employee is selected on the left by clicking on the employee name.
* To add an employee to the demo company, click the "Add Employee" button.
  * A modal will display with very basic information about the employee. 
  * Once you hit OK, the employee will be saved to local storage and the list of employees will update.
* To edit an employee, click the "Edit" button next to the employee.
  * A modal will display pre-filled with the employee info.
  * Once you hit OK, the employee will be updated to local storage and the list of employees will update.
* To delete an employee, click the "Remove" button next to the employee.
* Select an employee by clicking on the name to display the Dependent List.
* The Dependent List behaves very similarly to the Employee list in terms of adding dependents, except that the dependents are not saved to memory yet.
* As dependents are added/updated/removed, the total cost for the benefits is calculated and displayed below the list.
* Once the user is happy with the elections, they must hit Save to save the configured dependents.

## Notes

* Error handling is not implemented, however there are comments throughout the code in the form of TODOs indicating where error handling would go.
* Localization is not implemented, but instead of hard-coding English text we'd use libraries like react-i18next for different languages and locales.
* Accessibility is not implemented.  We'd need all the elements to handle screen readers, keyboard navigation, etc. to achieve production quality.
* UI is very basic and not all that pretty.  Ideally we'd be using a custom design system for components like buttons and modals and grids and nice images for editing and removing items instead of buttons.
* The calculation is slightly off due to floating point arithmetic and because we most likely won't be able to divide the cost equally among 26 paychecks.  We could calculate a penny higher deduction for each paycheck and also note the last paycheck would have a different final number.
* Might be nice to breakdown the total cost for the user so they understand where the costs come from for the current benefits package.
* Unit tests would be ideally implemented for each UI, but I only implemented some for the mock employee API to demonstrate testing.
