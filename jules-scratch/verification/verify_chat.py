from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        test_chat_functionality(page)
    finally:
        browser.close()

def test_chat_functionality(page: Page):
    # 1. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 2. Act: Log in as an employer.
    page.get_by_label("Email").fill("employer@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # 3. Assert: Verify that the employer is logged in.
    expect(page).to_have_url("http://localhost:3000/employer/dashboard")

    # 4. Act: Go to the post job page.
    page.get_by_role("link", name="Post a Job").click()

    # 5. Act: Post a new job.
    page.get_by_label("Job Title").fill("Software Engineer")
    page.get_by_label("Company").fill("Example Corp")
    page.get_by_label("Location").fill("San Francisco")
    page.get_by_label("Description").fill("This is a test job.")
    page.get_by_role("button", name="Post Job").click()

    # 6. Assert: Verify that the job was posted.
    expect(page.get_by_text("Job posted successfully")).to_be_visible()

    # 7. Act: Log out.
    page.get_by_role("button", name="Logout").click()

    # 8. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 9. Act: Log in as a job seeker.
    page.get_by_label("Email").fill("seeker@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # 10. Assert: Verify that the job seeker is logged in.
    expect(page).to_have_url("http://localhost:3000/")

    # 11. Act: Go to the jobs page.
    page.get_by_role("link", name="Find Jobs").click()

    # 12. Act: Apply for the job.
    page.get_by_role("link", name="Software Engineer").click()
    page.get_by_role("button", name="Apply Now").click()

    # 13. Assert: Verify that the job seeker applied for the job.
    expect(page.get_by_text("Application submitted successfully")).to_be_visible()

    # 14. Act: Log out.
    page.get_by_role("button", name="Logout").click()

    # 15. Arrange: Go to the login page.
    page.goto("http://localhost:3000/login")

    # 16. Act: Log in as an employer.
    page.get_by_label("Email").fill("employer@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # 17. Act: Go to the applications page.
    page.get_by_role("link", name="View Applications").click()

    # 18. Act: Initiate a chat with the job seeker.
    page.get_by_role("button", name="Chat").click()

    # 19. Assert: Verify that the chat window is open.
    expect(page.get_by_text("Chat with seeker@example.com")).to_be_visible()

    # 20. Act: Send a message.
    page.get_by_placeholder("Type a message...").fill("Hello, this is a test message.")
    page.get_by_role("button", name="Send").click()

    # 21. Assert: Verify that the message was sent.
    expect(page.get_by_text("Hello, this is a test message.")).to_be_visible()

    # 22. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/chat.png")

with sync_playwright() as p:
    run(p)