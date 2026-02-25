from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to planner...")
            # We access the file directly as python http server doesn't support redirects
            page.goto("http://localhost:8080/project-planner.html")

            print("Checking title...")
            if "Project Plan Dashboard" in page.title():
                print("Title verification passed.")
            else:
                print(f"Title verification failed. Got: {page.title()}")

            print("Checking for login screen...")
            if page.locator("text=Restricted Access").is_visible():
                print("Login screen visible.")
            else:
                print("Login screen not visible.")

            print("Taking screenshot...")
            page.screenshot(path="verification/verification_planner.png")
            print("Screenshot saved to verification/verification_planner.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
