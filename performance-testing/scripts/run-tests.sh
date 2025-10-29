#!/bin/bash

# This script runs the JMeter performance tests in non-GUI mode.
# It generates a CSV log file and an HTML dashboard report.

# Parameters
TEST_PLAN="performance-testing/test-plans/Job-Portal-API.jmx"
LOG_FILE="performance-testing/reports/results.csv"
REPORT_DIR="performance-testing/reports/dashboard"

# Clean up previous results
rm -f $LOG_FILE
rm -rf $REPORT_DIR
mkdir -p $REPORT_DIR

# Run JMeter
jmeter -n -t $TEST_PLAN -l $LOG_FILE -e -o $REPORT_DIR

echo "Performance test finished. Report available at $REPORT_DIR/index.html"
