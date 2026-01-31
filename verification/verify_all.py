
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # 1. Landing Page (ID)
        await page.goto("http://localhost:3000")
        await page.wait_for_timeout(2000) # Wait for animations
        await page.screenshot(path="verification/landing_id.png")

        # 2. Switch to EN
        await page.get_by_role("button", name="EN").first.click()
        await page.wait_for_timeout(1000)
        await page.screenshot(path="verification/landing_en.png")

        # 3. Media Page
        await page.goto("http://localhost:3000/media")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="verification/media_page.png")

        # 4. Admin Page
        await page.goto("http://localhost:3000/admin")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="verification/admin_page.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
