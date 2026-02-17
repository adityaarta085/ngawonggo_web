from playwright.sync_api import Page, expect, sync_playwright
import time

def bypass_verification(page: Page):
    try:
        # Wait for verification modal
        print("Bypassing security verification...")
        page.get_by_text("Saya bukan robot").click(timeout=5000)
        page.get_by_role("button", name="Lanjutkan ke Portal").click()
        time.sleep(2)
    except:
        pass

def verify(page: Page):
    page.set_default_timeout(60000)
    page.goto("http://localhost:3000/game-edukasi", wait_until="networkidle")
    bypass_verification(page)
    time.sleep(5)
    page.screenshot(path="verification/edugame.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify(page)
        finally:
            browser.close()
