from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        test_chat_and_dashboard(page)
    finally:
        browser.close()

def test_chat_and_dashboard(page: Page):
    # 1. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 2. Act: Log in as an employer.
    page.get_by_label("Email").fill("employer@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # 3. Assert: Verify that the employer is logged in and on the dashboard.
    expect(page).to_have_url("http://localhost:3000/employer/dashboard")

    # 4. Screenshot: Capture the enhanced dashboard.
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    # 5. Act: Go to the post job page.
    page.get_by_role("link", name="Post a Job").click()

    # 6. Act: Post a new job.
    page.get_by_label("Job Title").fill("Senior Software Engineer")
    page.get_by_label("Company").fill("Tech Solutions Inc.")
    page.get_by_label("Location").fill("Remote")
    page.get_by_label("Description").fill("This is a test job for a senior software engineer.")
    page.get_by_role("button", name="Post Job").click()

    # 7. Assert: Verify that the job was posted.
    expect(page.get_by_text("Job posted successfully")).to_be_visible()

    # 8. Act: Log out.
    page.get_by_role("button", name="Logout").click()

    # 9. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 10. Act: Log in as a job seeker.
    page.get_by_label("Email").fill("seeker@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # 11. Assert: Verify that the job seeker is logged in.
    expect(page).to_have_url("http://localhost:3000/")

    # 12. Act: Go to the jobs page.
    page.get_by_role("link", name="Find Jobs").click()

    # 13. Act: Apply for the job.
    page.get_by_role("link", name="Senior Software Engineer").click()
    page.get_by_role("button", name="Apply Now").click()

    # 14. Assert: Verify that the job seeker applied for the job.
    expect(page.get_by_text("Application submitted successfully")).to_be_visible()

    # 15. Act: Log out.
    page.get_by_role("button", name="Logout").click()

    # 16. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 17. Act: Log in as an employer.
    page.get_by_label("Email").fill("employer@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # 18. Act: Go to the applications page.
    page.get_by_role("link", name="View Applications").click()

    # 19. Act: Shortlist the candidate.
    page.get_by_role("button", name="Shortlist").click()

    # 20. Act: Initiate a chat with the job seeker.
    page.get_by_role("button", name="Chat").click()

    # 21. Assert: Verify that the chat window is open with the correct recipient name.
    expect(page.get_by_text("Chat with John Doe")).to_be_visible()

    # 22. Act: Send a message.
    page.get_by_placeholder("Type a message...").fill("Hello, this is a test message from the employer.")
    page.get_by_role("button", name="Send").click()

    # 23. Assert: Verify that the message was sent.
    expect(page.get_by_text("Hello, this is a test message from the employer.")).to_be_visible()

    # 24. Screenshot: Capture the chat window.
    page.screenshot(path="jules-scratch/verification/chat.png")

with sync_playwright() as p:
    run(p)