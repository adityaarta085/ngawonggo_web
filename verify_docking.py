import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the app
        print("Navigating to http://localhost:3001...")
        await page.goto("http://localhost:3001")

        # Wait for splash screen to disappear
        print("Waiting for splash screen to finish...")
        # Splash screen takes some time. Let's wait for the verification overlay to appear.
        await page.wait_for_selector("text=Saya bukan robot", timeout=20000)

        # Handle verification
        print("Handling Human Verification...")
        await page.click("text=Saya bukan robot")
        await page.click("text=Lanjutkan ke Portal")

        # Wait for verification to complete and landing page to load
        await asyncio.sleep(2)

        # Capture initial visible state
        print("Capturing initial visible state...")
        await page.screenshot(path="/home/jules/verification/v3_initial.png")

        # Wait for docking (10s timer)
        print("Waiting for docking timer (12s)...")
        await asyncio.sleep(12)

        # Capture docked state
        print("Capturing docked state...")
        await page.screenshot(path="/home/jules/verification/v3_docked.png")

        # Check for handles
        print("Checking for buttons...")
        player_handle = page.locator('button[aria-label="Show player"]')
        chat_handle = page.locator('button[aria-label="Show chat"]')

        if await player_handle.is_visible():
            print("Player handle is visible.")
        else:
            print("Player handle NOT found!")

        if await chat_handle.is_visible():
            print("Chat handle is visible.")
        else:
            print("Chat handle NOT found!")

        # Click player handle to restore
        print("Clicking player handle...")
        await player_handle.click()
        await asyncio.sleep(2) # animation
        await page.screenshot(path="/home/jules/verification/v3_player_restored.png")

        # Click chat handle to restore
        print("Clicking chat handle...")
        await chat_handle.click()
        await asyncio.sleep(2) # animation
        await page.screenshot(path="/home/jules/verification/v3_all_restored.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
