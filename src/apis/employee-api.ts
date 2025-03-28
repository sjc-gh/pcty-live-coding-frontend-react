// NOTE:
// For simplicity, I'm merging all functionality into a single API.  In a sufficiently large and complex,
// system, there would most likely be comprehensive APIs for each of these services.

import _ from 'lodash';

// NOTE:
// This is the current id of the company we're editing employees and dependents for.
export function getDemoCompanyId(): string {
  return '7e92a294-8d5d-482b-a148-c6f4b6b3d25c';
}

// NOTE:
// This is a demo benefits package id for a given company.  Theoretically a particular company has multiple
// benefits packages which have different costs associated with them.  For now, we're assuming a single
// package with info provided in the requirements.
export function getDemoPackageId(): string {
  return '1';
}

export type NameInfo = {
  prefix?: string;
  first: string;
  middle?: string;
  last: string;
  suffix?: string;
};

export type EmployeeInfo = {
  employeeId: string;
  legalName: NameInfo;
  // ... preferred name, contact info, date of birth, etc.
};

export enum DependentType {
  Self = 'self',
  Spouse = 'spouse',
  Child = 'child',
  Unknown = 'unknown',
};

export type DependentInfo = {
  dependentId: string;
  legalName: NameInfo;
  type: DependentType;
  // ...date of birth, SSN, etc.
};

export type BenefitsInfo = {
  dependents: DependentInfo[];
  packageId: string;
  // ... benefits package type, other elections, etc.
};

export type PayrollInfo = {
  grossPaycheck: number;
  // ... 
};

export interface EmployeeApi {
  //
  addOrUpdateEmployee(companyId: string, info: EmployeeInfo): Promise<void>;

  // Rejects with an Error in case of failure.
  calculateBenefitsCost(companyId: string, packageId: string, dependents: DependentInfo[]): Promise<number>;

  // Rejects with an Error in case of failure.
  getBenefitsInfo(companyId: string, employeeId: string): Promise<BenefitsInfo>;

  // Rejects with an Error in case of failure.
  getEmployees(companyId: string): Promise<EmployeeInfo[]>;

  // Rejects with an Error in case of failure.
  getPayrollInfo(companyId: string, employeeId: string): Promise<PayrollInfo>;

  //
  removeEmployee(companyId: string, info: EmployeeInfo): Promise<void>;

  // Rejects with an Error in case of failure.
  updateBenefitsInfo(companyId: string, employeeId: string, info: BenefitsInfo): Promise<void>;
}

class LocalStorageEmployeeApi implements EmployeeApi {
  async addOrUpdateEmployee(companyId: string, info: EmployeeInfo): Promise<void> {
    const employees = await this.getEmployees(companyId);

    const result = employees.find(value => info.employeeId === value.employeeId);
    
    if (result) {
      result.legalName.prefix = info.legalName.prefix
      result.legalName.first = info.legalName.first;
      result.legalName.middle = info.legalName.middle;
      result.legalName.last = info.legalName.last;
      result.legalName.suffix = info.legalName.suffix;
    } else {
      employees.push(_.cloneDeep(info));
    }

    this.setItem<EmployeeInfo[]>(companyId.concat('.employees'), employees);

    return Promise.resolve();
  }

  async calculateBenefitsCost(companyId: string, packageId: string, dependents: DependentInfo[]): Promise<number> {
    if (companyId !== getDemoCompanyId()) {
      throw new Error('Unknown company id');
    }
    if (packageId !== getDemoPackageId()) {
      throw new Error('Unknown benefits package id');
    }

    // NOTE:
    // It makes sense for the server to be aware of all the package ids and how to calculate
    // the cost for each dependent.  This particular package is defined in the requirements.
    const totalCost = dependents.reduce((previousValue, currentValue) => {
      // Anyone whose name starts with ‘A’ gets a 10% discount, employee or dependent.
      // NOTE:
      // The requirements didn't specify first name or last name, so going with first name.
      // They also didn't specify if A accented by special characters are included, such
      // as Á, Â, Ä, and Ã.  Will just keep A for now.
      const discountFactor = currentValue.legalName.first.startsWith('A') ? 0.9 : 1.0;

      // The cost of benefits is $1000/year for each employee.
      // Each dependent (children and possibly spouses) incurs a cost of $500/year.
      const cost = (currentValue.type === DependentType.Self ? 1000.0 : 500.0) * discountFactor;

      return previousValue + cost;
    }, 0.0);

    // ASSUMPTION:
    // There are 26 paychecks in a year.
    const costPerPaycheck = totalCost / 26;

    // NOTE:
    // It's almost certain that the cost will not divide evenly into 26 equal parts.
    // Outside of calculating a payment schedule and rendering it to the user, we'll
    // calculate an upper bound for a paycheck deduction and the last paycheck deduction
    // would be slightly less.
    return Promise.resolve(Math.round((costPerPaycheck + Number.EPSILON) * 100) / 100);
  }

  async getBenefitsInfo(companyId: string, employeeId: string): Promise<BenefitsInfo> {
    if (companyId !== getDemoCompanyId()) {
      throw new Error('Unknown company id');
    }
    // TODO: Verify employee id exists in company id.
    return this.getItem<BenefitsInfo>(employeeId.concat('.benefits'), () => ({
      dependents: [],
      packageId: getDemoPackageId(),  // Could be multiple benefits packages.
    }));
  }

  async getEmployees(companyId: string): Promise<EmployeeInfo[]> {
    if (companyId !== getDemoCompanyId()) {
      throw new Error('Unknown company id');
    }

    return this.getItem<EmployeeInfo[]>(companyId.concat('.employees'), () => []);
  }

  async getPayrollInfo(companyId: string, employeeId: string): Promise<PayrollInfo> {
    if (companyId !== getDemoCompanyId()) {
      throw new Error('Unknown company id');
    }
    // TODO: Verify employee id exists in company id.
    return this.getItem<PayrollInfo>(employeeId.concat('.payroll'), () => ({
      grossPaycheck: 2000,
    }));
  }

  async removeEmployee(companyId: string, info: EmployeeInfo): Promise<void> {
    const employees = await this.getEmployees(companyId);

    const result = employees.filter(value => info.employeeId !== value.employeeId);
    
    if (result.length === employees.length) {
      throw new Error('Trying to remove an employee that does not exist by id');
    }

    this.setItem<EmployeeInfo[]>(companyId.concat('.employees'), result);

    // TODO: Remove benefits and payroll info for employee.

    return Promise.resolve();
  }

  async updateBenefitsInfo(companyId: string, employeeId: string, info: BenefitsInfo): Promise<void> {
    if (companyId !== getDemoCompanyId()) {
      throw new Error('Unknown company id');
    }
    if (info.packageId !== getDemoPackageId()) {
      throw new Error('Unknown benefits package id');
    }
    // TODO: Verify employee id exists in company id.
    return this.setItem(employeeId.concat('.benefits'), info);
  }

  private async getItem<T>(key: string, createDefault: () => T): Promise<T> {
    let infoString = localStorage.getItem(key);
    if (infoString !== null) {
      return Promise.resolve(JSON.parse(infoString) as T);
    } else {
      const info = createDefault();
      localStorage.setItem(key, JSON.stringify(info));
      return Promise.resolve(info);
    }
  }

  private async setItem<T>(key: string, info: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(info));
    return Promise.resolve();
  }
}

const employeeApi = new LocalStorageEmployeeApi();

export function getEmployeeApi(): EmployeeApi {
  return employeeApi;
}

