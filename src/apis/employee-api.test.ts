import { DependentType, getDemoCompanyId, getDemoPackageId, getEmployeeApi } from './employee-api';

describe('employee-api', () => {
  it('shall calculate the cost of benefits given a single employee', async () => {
    const costPerPaycheck = await getEmployeeApi().calculateBenefitsCost(
      getDemoCompanyId(),
      getDemoPackageId(),
      [
        {
          dependentId: '1',
          legalName: {
            first: 'Homer',
            last: 'Simpson',
          },
          type: DependentType.Self,
        }
      ]
    );

    expect(costPerPaycheck).toBe(38.47);
  });

  it('shall calculate the cost of benefits given a single employee with discount', async () => {
    const costPerPaycheck = await getEmployeeApi().calculateBenefitsCost(
      getDemoCompanyId(),
      getDemoPackageId(),
      [
        {
          dependentId: '1',
          legalName: {
            first: 'Andrea',
            last: 'Simpson',
          },
          type: DependentType.Self,
        }
      ]
    );

    expect(costPerPaycheck).toBe(34.62);
  });

  it('shall return default benefits info', async () => {
    const info = await getEmployeeApi().getBenefitsInfo(
      getDemoCompanyId(),
      '4815162342',
    );

    expect(info.dependents.length).toBe(0);
  });

  it('shall return default payroll info', async () => {
    const info = await getEmployeeApi().getPayrollInfo(
      getDemoCompanyId(),
      '4815162342',
    );

    expect(info.grossPaycheck).toBe(2000);
  });

  it('shall save updated depenents', async () => {
    const info = await getEmployeeApi().getBenefitsInfo(
      getDemoCompanyId(),
      '4815162342',
    );

    info.dependents.push({
      dependentId: '1',
      legalName: {
        first: 'Jack',
        last: 'Shepherd',
      },
      type: DependentType.Self,
    });

    await getEmployeeApi().updateBenefitsInfo(
      getDemoCompanyId(),
      '4815162342',
      info,
    );

    const updatedInfo = await getEmployeeApi().getBenefitsInfo(
      getDemoCompanyId(),
      '4815162342',
    );

    expect(updatedInfo).toMatchObject(info);
  });
});
