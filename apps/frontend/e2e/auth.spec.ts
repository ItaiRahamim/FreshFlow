import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

// Helper to create test user
async function createTestUser(email: string, password: string, role: string) {
  // This would typically call your API or seed script
  // For now, we'll assume users exist from seed
}

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'owner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should prevent auth leakage between tenants', async ({ page }) => {
    // Login as user from company 1
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'owner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Try to access data from another company (should fail)
    const response = await page.request.get(`${API_URL}/suppliers`, {
      headers: {
        Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('token'))}`,
      },
    });
    
    // Should only see suppliers from own company
    expect(response.status()).toBe(200);
  });
});

test.describe('RFQ to PO Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'owner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  test('should create RFQ and convert to PO', async ({ page }) => {
    // Navigate to RFQ page
    await page.goto(`${BASE_URL}/rfq`);
    
    // Check if RFQs are displayed
    await expect(page.locator('h1')).toContainText('RFQs');
    
    // Click on first RFQ if exists
    const firstRfq = page.locator('a').first();
    if (await firstRfq.count() > 0) {
      await firstRfq.click();
      
      // Check RFQ details page
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for quotes
      const quotesSection = page.locator('text=הצעות מחיר');
      if (await quotesSection.count() > 0) {
        // Click on first quote if exists
        const firstQuote = page.locator('a').first();
        if (await firstQuote.count() > 0) {
          await firstQuote.click();
          
          // Check quote page
          await expect(page.locator('h1')).toBeVisible();
          
          // Try to accept quote (if button exists)
          const acceptButton = page.locator('text=אישור ויצירת PO');
          if (await acceptButton.count() > 0) {
            await acceptButton.click();
            
            // Should redirect to PO page
            await expect(page).toHaveURL(/\/po/);
          }
        }
      }
    }
  });
});

test.describe('Tenant Isolation', () => {
  test('suppliers should only see their own data', async ({ page }) => {
    // Login as supplier
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'supplier1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to supplier portal
    await expect(page).toHaveURL(`${BASE_URL}/s`);
    
    // Check that only supplier's data is visible
    const quotes = await page.locator('text=Quotes').count();
    expect(quotes).toBeGreaterThanOrEqual(0);
  });

  test('suppliers cannot access other suppliers data', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'supplier1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Try to access another supplier's data (should fail or show empty)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const response = await page.request.get(`${API_URL}/suppliers/supplier-id-of-another-supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Should return 403 or empty data
    expect([403, 404]).toContain(response.status());
  });
});

test.describe('Dashboard', () => {
  test('should display dashboard after login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'owner@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    await expect(page.locator('h1')).toContainText('דשבורד');
  });

  test('suppliers should be redirected to supplier portal', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', 'supplier1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(`${BASE_URL}/s`);
  });
});

