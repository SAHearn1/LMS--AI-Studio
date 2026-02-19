import { expect, test } from '@playwright/test';

type RoleName = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

type RoleCase = {
  role: RoleName;
  email: string;
  expectedHome: string;
  deniedPath: string;
};

const PASSWORD = process.env.E2E_PASSWORD || 'demo123';

const roleCases: RoleCase[] = [
  {
    role: 'ADMIN',
    email: process.env.E2E_ADMIN_EMAIL || 'admin@rootwork.edu',
    expectedHome: '/admin',
    deniedPath: '/student',
  },
  {
    role: 'TEACHER',
    email: process.env.E2E_TEACHER_EMAIL || 'msmith@rootwork.edu',
    expectedHome: '/teacher',
    deniedPath: '/admin',
  },
  {
    role: 'STUDENT',
    email: process.env.E2E_STUDENT_EMAIL || 'noah.3@rootwork.edu',
    expectedHome: '/student',
    deniedPath: '/admin',
  },
  {
    role: 'PARENT',
    email: process.env.E2E_PARENT_EMAIL || 'parent.anderson@email.com',
    expectedHome: '/parent',
    deniedPath: '/teacher',
  },
];

async function login(page: Parameters<typeof test>[0]['page'], email: string) {
  await page.goto('/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Role-Based Access Validation', () => {
  for (const roleCase of roleCases) {
    test(`${roleCase.role}: can sign in and view dashboard role`, async ({ page }) => {
      await login(page, roleCase.email);
      await expect(page.getByText(new RegExp(`Role:\\s*${roleCase.role}`))).toBeVisible();
    });

    test(`${roleCase.role}: denied route redirects to role home`, async ({ page }) => {
      await login(page, roleCase.email);
      await page.goto(roleCase.deniedPath);
      await expect(page).toHaveURL(new RegExp(`${roleCase.expectedHome}$`));
    });
  }
});
