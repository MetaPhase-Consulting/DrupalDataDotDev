# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release with core functionality
- Multiple visualization types: bar, line, pie, maps, radar, scatter
- Support for multiple charting libraries: Chart.js, D3.js, Highcharts, ECharts, OpenLayers, Leaflet
- Multiple output formats: JavaScript embed, static HTML, Drupal block plugins, Drupal controllers
- Theme support with dark and light modes
- Data input via JSON with sample datasets
- Export options: single file or complete ZIP packages
- Responsive design with mobile support
- Accessibility features
- TypeScript support
- ESLint configuration
- Comprehensive documentation

### Changed
- Refactored code generator into modular architecture
- Improved maintainability and extensibility
- Enhanced type safety with shared interfaces
- Better separation of concerns

### Removed
- Hierarchical, timeline, and statistical visualization types (not being used)

### Fixed
- Library-specific Drupal block generation
- Enhanced ZIP download functionality
- Proper Drupal module structure
- Chart type mapping for all visualization types
- Data normalization across all libraries

## [0.0.1] - 2024-01-01

### Added
- Initial project setup
- Basic React application structure
- TypeScript configuration
- Vite build system
- Tailwind CSS styling
- Component architecture
- Service layer for code generation
- Data management system

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
