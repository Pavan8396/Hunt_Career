import asyncio
from playwright.async_api import async_playwright, expect
import random
import string

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Generate random data for uniqueness
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        employer_email = f"employer_{random_suffix}@test.com"
        employer_password = "password123"
        company_name = f"Test Company {random_suffix}"

        user_email = f"user_{random_suffix}@test.com"
        user_password = "password123"
        user_firstname = "Test"
        user_lastname = "User"

        job_title = f"Software Engineer {random_suffix}"
        job_description = "This is a test job description."
        job_location = "Remote"

        # --- Employer Signup ---
        await page.goto("http://localhost:3000/employer-signup")
        print(await page.content())
        await page.get_by_label("Company Name").fill(company_name, timeout=60000)
        await page.get_by_label("Email").fill(employer_email)
        await page.get_by_label("Password").fill(employer_password)
        await page.get_by_role("button", name="Sign Up").click()
        await expect(page.get_by_text("Employer registered successfully")).to_be_visible()

        # --- Employer Login ---
        await page.goto("http://localhost:3000/employer-login")
        await page.get_by_label("Email").fill(employer_email)
        await page.get_by_label("Password").fill(employer_password)
        await page.get_by_role("button", name="Login").click()
        await expect(page.get_by_text(f"Welcome, {company_name}")).to_be_visible()

        # --- Post a Job ---
        await page.goto("http://localhost:3000/post-job")
        await page.get_by_label("Job Title").fill(job_title)
        await page.get_by_label("Location").fill(job_location)
        await page.get_by_label("Job Description").fill(job_description)
        await page.get_by_role("button", name="Post Job").click()
        await expect(page.get_by_text("Job posted successfully")).to_be_visible()

        # --- Logout Employer ---
        await page.get_by_role("button", name="Logout").click()
        await expect(page.get_by_role("button", name="Login")).to_be_visible()

        # --- User Signup ---
        await page.goto("http://localhost:3000/signup")
        await page.get_by_label("First Name").fill(user_firstname)
        await page.get_by_label("Last Name").fill(user_lastname)
        await page.get_by_label("Email").fill(user_email)
        await page.get_by_label("Password").fill(user_password)
        await page.get_by_role("button", name="Sign Up").click()
        await expect(page.get_by_text("Signup successful!")).to_be_visible()

        # --- User Login ---
        await page.goto("http://localhost:3000/login")
        await page.get_by_label("Email").fill(user_email)
        await page.get_by_label("Password").fill(user_password)
        await page.get_by_role("button", name="Login").click()
        await expect(page.get_by_text(f"Welcome, {user_firstname}")).to_be_visible()

        # --- Apply for the Job ---
        await page.goto("http://localhost:3000/")
        await page.get_by_text(job_title).click()
        await page.get_by_role("button", name="Apply Now").click()
        await expect(page.get_by_text("Application submitted successfully")).to_be_visible()

        # --- Logout User ---
        await page.get_by_role("button", name="Logout").click()
        await expect(page.get_by_role("button", name="Login")).to_be_visible()

        # --- Employer Login (again) ---
        await page.goto("http://localhost:3000/employer-login")
        await page.get_by_label("Email").fill(employer_email)
        await page.get_by_label("Password").fill(employer_password)
        await page.get_by_role("button", name="Login").click()
        await expect(page.get_by_text(f"Welcome, {company_name}")).to_be_visible()

        # --- View Applications ---
        await page.goto("http://localhost:3000/posted-jobs")
        await page.get_by_role("button", name="View Applications").click()

        # --- Verification ---
        await expect(page.get_by_text(f"{user_firstname} {user_lastname}")).to_be_visible()
        await expect(page.get_by_text(user_email)).to_be_visible()

        await page.screenshot(path="jules-scratch/verification/verification.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
