import { test, expect } from '@playwright/test';

test.describe('다크모드 테마 가독성 테스트', () => {
  test('홈페이지 - 라이트모드 가독성 테스트', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 라이트모드 설정
    await page.locator('[title="라이트 모드"]').click();
    
    // 주요 텍스트가 잘 보이는지 확인
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toHaveText('Patchlog');
    
    // 색상 대비 확인을 위한 스크린샷
    await page.screenshot({ path: 'tests/screenshots/home-light.png', fullPage: true });
    
    // CTA 버튼이 잘 보이는지 확인
    const ctaButton = page.locator('text=패치노트 확인하기');
    await expect(ctaButton).toBeVisible();
  });

  test('홈페이지 - 다크모드 가독성 테스트', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 다크모드 설정
    await page.locator('[title="다크 모드"]').click();
    
    // 다크모드 적용 대기
    await page.waitForTimeout(500);
    
    // 주요 텍스트가 잘 보이는지 확인
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toHaveText('Patchlog');
    
    // 색상 대비 확인을 위한 스크린샷
    await page.screenshot({ path: 'tests/screenshots/home-dark.png', fullPage: true });
    
    // CTA 버튼이 잘 보이는지 확인
    const ctaButton = page.locator('text=패치노트 확인하기');
    await expect(ctaButton).toBeVisible();
    
    // 배경이 다크모드로 변경되었는지 확인
    const body = page.locator('body');
    await expect(body).toHaveClass(/dark:bg-gray-900/);
  });

  test('패치 목록 페이지 - 라이트모드 가독성 테스트', async ({ page }) => {
    await page.goto('http://localhost:3000/patch');
    
    // 라이트모드 설정
    await page.locator('[title="라이트 모드"]').click();
    
    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');
    
    // 스크린샷
    await page.screenshot({ path: 'tests/screenshots/patch-list-light.png', fullPage: true });
  });

  test('패치 목록 페이지 - 다크모드 가독성 테스트', async ({ page }) => {
    await page.goto('http://localhost:3000/patch');
    
    // 다크모드 설정
    await page.locator('[title="다크 모드"]').click();
    
    // 다크모드 적용 대기
    await page.waitForTimeout(500);
    
    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');
    
    // 스크린샷
    await page.screenshot({ path: 'tests/screenshots/patch-list-dark.png', fullPage: true });
  });

  test('테마 토글 기능 테스트', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 시스템 테마 버튼 확인
    const systemButton = page.locator('[title="시스템 설정"]');
    await expect(systemButton).toBeVisible();
    
    // 라이트 모드 버튼 확인
    const lightButton = page.locator('[title="라이트 모드"]');
    await expect(lightButton).toBeVisible();
    
    // 다크 모드 버튼 확인
    const darkButton = page.locator('[title="다크 모드"]');
    await expect(darkButton).toBeVisible();
    
    // 각 테마로 전환해보기
    await lightButton.click();
    await page.waitForTimeout(300);
    
    await darkButton.click();
    await page.waitForTimeout(300);
    
    await systemButton.click();
    await page.waitForTimeout(300);
    
    // 테마 전환이 원활히 작동하는지 스크린샷으로 확인
    await page.screenshot({ path: 'tests/screenshots/theme-toggle-test.png' });
  });
});