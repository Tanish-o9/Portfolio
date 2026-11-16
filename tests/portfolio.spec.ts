import { test, expect } from '@playwright/test';
import { resumeContent } from '../src/data/content';

test.describe("Tanish's AI Village Portfolio Suite", () => {
  test('Data integrity: skills strictly match approved resume categories', () => {
    const approvedCategories = [
      'AI & LLM Engineering',
      'Agentic AI',
      'Machine Learning & Deep Learning',
      'Backend & Frontend',
      'Data & Vector Search',
      'DevOps & Cloud',
      'Programming Languages',
    ];

    const actualCategories = resumeContent.technicalSkills.map((c) => c.category);
    expect(actualCategories).toEqual(approvedCategories);
  });

  test('Data integrity: metrics match verified resume benchmarks', () => {
    const quantora = resumeContent.featuredProjects.find((p) => p.id === 'quantora');
    expect(quantora).toBeDefined();
    expect(quantora?.metrics.some((m) => m.value.includes('76%'))).toBe(true);
    expect(quantora?.metrics.some((m) => m.value.includes('1.19x'))).toBe(true);

    const pramaan = resumeContent.featuredProjects.find((p) => p.id === 'pramaan-ai');
    expect(pramaan).toBeDefined();
    expect(pramaan?.metrics.some((m) => m.value.includes('0.942'))).toBe(true);

    const whytrace = resumeContent.featuredProjects.find((p) => p.id === 'whytrace-ai');
    expect(whytrace).toBeDefined();
    expect(whytrace?.metrics.some((m) => m.value.includes('14'))).toBe(true);
  });

  test('Navigation to /classic renders full portfolio', async ({ page }) => {
    await page.goto('http://localhost:3000/classic');
    await expect(page.locator('text=Building Intelligent Systems')).toBeVisible();
    await expect(page.locator('text=QUANTORA')).toBeVisible();
    await expect(page.locator('text=Pramaan.ai')).toBeVisible();
    await expect(page.locator('text=WhyTrace.ai')).toBeVisible();
  });
});
