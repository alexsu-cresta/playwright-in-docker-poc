/**
 * Golden-image screenshot comparison runs only when SCREENSHOT_TESTS=true
 * (Docker/CI). Local dev commands leave this unset so OS rendering differences
 * do not fail the suite.
 */
export const screenshotTestsEnabled = process.env.SCREENSHOT_TESTS === 'true';
