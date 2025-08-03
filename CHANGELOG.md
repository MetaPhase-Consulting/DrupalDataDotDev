# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of DrupalData.dev
- Support for multiple charting libraries (Chart.js, Highcharts, ECharts)
- Multiple visualization types: bar, line, pie, maps, radar, statistical
- CSV and JSON data input support
- Built-in sample datasets
- Theme system with multiple styling options
- Code generation for multiple output formats:
  - Raw JavaScript
  - Drupal block plugins
  - Drupal controllers with routes
  - Complete Drupal modules (ZIP)
  - Standalone HTML files
- Responsive design with dark/light mode
- Accessibility features (WCAG 2.1 AA)
- Input sanitization and XSS protection
- File upload validation

### Security
- Implemented input sanitization for all user inputs
- Added file upload validation and size limits
- XSS protection for generated code
- Secure handling of user data

## [1.0.0] - 2024-01-XX

### Added
- Initial stable release
- Complete documentation
- Security policy
- Contributing guidelines
- Code of conduct

---

## Release Notes Format

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Version Format

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Links

- [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [GitHub Releases](../../releases)
