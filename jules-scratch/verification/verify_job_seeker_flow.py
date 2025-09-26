import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # --- Verification Step 1: User Type Selection Page ---
    print("Verifying User Type Selection page...")
    page.goto("http://localhost:3000/")

    # Check that Login/Signup links are not visible
    login_link = page.locator('a:has-text("Login")').first
    signup_link = page.locator('a:has-text("Signup")').first
    expect(login_link).not_to_be_visible()
    expect(signup_link).not_to_be_visible()
    page.screenshot(path="jules-scratch/verification/01_user_type_selection.png")
    print("Screenshot 1: User Type Selection page - OK")

    # --- Verification Step 2: Navigate to Job Seeker Flow ---
    print("Navigating to Job Seeker flow...")
    page.get_by_role("heading", name="I am a Job Seeker").click()
    page.wait_for_url("**/home")

    # Check that Login/Signup links are now visible
    expect(login_link).to_be_visible()
    expect(signup_link).to_be_visible()
    page.screenshot(path="jules-scratch/verification/02_home_page_unauthenticated.png")
    print("Screenshot 2: Home page (unauthenticated) - OK")

    # --- Verification Step 3: Attempt to Save a Job (unauthenticated) ---
    print("Attempting to save a job while unauthenticated...")
    # Click the "Save" button on the first job card
    first_job_card = page.locator('.bg-white').first
    save_button = first_job_card.get_by_role("button", name="Save")

    # It might be a custom element, so let's try a different selector if needed
    if not save_button.is_visible():
        save_button = first_job_card.locator('button:has-text("Save")')

    save_button.click()

    # Check for redirection to the login page
    page.wait_for_url("**/login")
    expect(page).to_have_url(re.compile(".*login"))
    page.screenshot(path="jules-scratch/verification/03_redirect_to_login_on_save.png")
    print("Screenshot 3: Redirect to login on save - OK")

    # --- Verification Step 4: Login Page ---
    print("Verifying Login page...")
    # Check that Login/Signup links are not visible
    expect(login_link).not_to_be_visible()
    expect(signup_link).not_to_be_visible()
    page.screenshot(path="jules-scratch/verification/04_login_page.png")
    print("Screenshot 4: Login page - OK")

    # --- Verification Step 5: Navigate back to home and go to job details ---
    print("Navigating to Job Details page...")
    page.goto("http://localhost:3000/home")
    page.wait_for_url("**/home")
    # Click the first job card link to navigate to details
    first_job_link = page.locator('a[href*="/jobs/"]').first
    first_job_link.click()
    page.wait_for_url("**/jobs/*")

    # Check that Login/Signup links are visible
    expect(login_link).to_be_visible()
    expect(signup_link).to_be_visible()
    page.screenshot(path="jules-scratch/verification/05_job_details_unauthenticated.png")
    print("Screenshot 5: Job Details page (unauthenticated) - OK")

    # --- Verification Step 6: Attempt to Apply for a Job (unauthenticated) ---
    print("Attempting to apply for a job while unauthenticated...")
    page.get_by_role("button", name="Apply").click()

    # Check for redirection to the login page
    page.wait_for_url("**/login")
    expect(page).to_have_url(re.compile(".*login"))
    page.screenshot(path="jules-scratch/verification/06_redirect_to_login_on_apply.png")
    print("Screenshot 6: Redirect to login on apply - OK")

    print("\nVerification script completed successfully!")
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)