# Performance Testing Guide

This guide provides detailed instructions on how to set up the environment, run the performance tests, and interpret the generated reports.

## 1. Prerequisites

Before you can run the performance tests, you need to have the following software installed:

- **Java Development Kit (JDK):** Version 8 or higher.
- **Apache JMeter:** Version 5.0 or higher. Make sure the `jmeter` command is in your system's PATH.

## 2. Environment Setup

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Start the Application:**
    Ensure the backend application is running on `http://localhost:5000`.

## 3. Running the Performance Tests

To run the performance tests, execute the `run-tests.sh` script from the root of the project:

```bash
./performance-testing/scripts/run-tests.sh
```

The script will:
1.  Clean up any previous test results.
2.  Run the JMeter test plan in non-GUI mode.
3.  Generate a CSV file with the raw results in `performance-testing/reports/results.csv`.
4.  Generate a detailed HTML dashboard report in the `performance-testing/reports/dashboard` directory.

## 4. Interpreting the Report

After the test run is complete, open the `index.html` file located in the `performance-testing/reports/dashboard` directory in your web browser.

The HTML report provides a wealth of information, including:

- **APDEX (Application Performance Index):** A summary of the application's performance.
- **Charts and Graphs:** Visual representations of metrics like response times, throughput, and error rates.
- **Statistics:** Detailed tables with metrics for each request.

Analyze the report to identify any performance bottlenecks, high error rates, or long response times that need to be addressed.
