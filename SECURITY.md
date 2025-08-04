# Security Policy

## Supported Versions

We actively support the following versions of DrupalData.dev with security updates:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The DrupalData.dev team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing security@drupaldata.dev or by using GitHub's private vulnerability reporting feature.

### What to Include

To help us better understand and resolve the issue, please include as much information as possible:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s)** related to the manifestation of the issue
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration** required to reproduce the issue
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit the issue

### Response Timeline

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Status Updates**: We will send you regular updates about our progress every 7 days
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days of initial report
- **Disclosure**: We will work with you to determine an appropriate disclosure timeline

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Don't access, modify, or delete user data without explicit permission
- Contact us first before sharing details of any vulnerability with others

### Scope

This policy applies to the following systems and applications:

- **In Scope:**
  - DrupalData.dev web application (drupaldata.dev)
  - This GitHub repository code
  - Generated code output (potential XSS/injection issues)
  - File upload functionality
  - Data processing and visualization features

- **Out of Scope:**
  - Social engineering attacks
  - Physical attacks
  - Attacks against third-party services (Chart.js, Highcharts, etc.)
  - Denial of service attacks
  - Spam or social engineering techniques

### Security Measures

DrupalData.dev implements several security measures:

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **File Upload Validation**: Strict file type and size validation for uploads
- **Content Security Policy**: CSP headers to prevent code injection
- **Dependency Management**: Regular updates of dependencies with security patches
- **Secure Defaults**: Secure configuration by default
- **HTTPS Enforcement**: All traffic encrypted in transit

### Bug Bounty

While we don't currently offer a formal bug bounty program, we deeply appreciate security research and will:

- Acknowledge your contribution in our security advisories (if desired)
- Provide public recognition for your responsible disclosure
- Consider implementing suggested security improvements
- Maintain open communication throughout the resolution process

### Previous Security Issues

We maintain transparency about resolved security issues:

- **No security vulnerabilities have been reported or resolved at this time**

### Contact Information

- **Security Email**: security@drupaldata.dev
- **General Contact**: support@drupaldata.dev
- **GitHub Security**: Use GitHub's private vulnerability reporting feature

Thank you for helping keep DrupalData.dev and our users safe!