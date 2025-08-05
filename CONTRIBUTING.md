# Contributing to DrupalData.dev

Thank you for your interest in contributing to DrupalData.dev! We welcome contributions from developers of all skill levels. This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior through GitHub Issues.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the [existing issues](../../issues) to avoid duplicates. When creating a bug report, please include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node.js version)
- **Additional context** that might be helpful

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) when available.

### 💡 Suggesting Features

We love feature suggestions! Before creating enhancement suggestions:

1. Check if the feature already exists
2. Check if it's already been suggested in [issues](../../issues)
3. Consider if the feature fits the project's scope and goals

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- **Clear title and description**
- **Use case and motivation**
- **Detailed description** of the proposed feature
- **Mockups or examples** if applicable

### 🔧 Contributing Code

We welcome code contributions! Here are some areas where help is especially appreciated:

- **New chart types and visualizations**
- **Additional charting library support**
- **Theme and styling improvements**
- **Performance optimizations**
- **Accessibility improvements**
- **Bug fixes**
- **Documentation improvements**
- **Test coverage**

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- A GitHub account
- A code editor (VS Code recommended)

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/DrupalDataDotDev.git
   cd DrupalDataDotDev
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/MetaPhase-Consulting/DrupalDataDotDev.git
   ```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your changes.

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Build to check for errors
npm run build

# Test the application manually
npm run dev
```

### 4. Commit Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add support for bubble charts in ECharts

- Add bubble chart configuration
- Update sample data for bubble charts
- Add bubble chart options in UI
- Update code generation for bubble charts

Closes #123"
```

#### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request through GitHub.

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Documentation has been updated if needed
- [ ] Changes have been tested manually
- [ ] No new linting errors introduced

### Pull Request Guidelines

1. **Use the PR template** when available
2. **Clear title and description** of what the PR does
3. **Reference related issues** using keywords (e.g., "Closes #123")
4. **Include screenshots** for UI changes
5. **Keep PRs focused** - one feature/fix per PR
6. **Update documentation** if your changes affect it

### Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by maintainers
3. **Testing** of the changes
4. **Approval** and merge by maintainers

We aim to review PRs within 3-5 business days. Large PRs may take longer.

## Style Guidelines

### TypeScript/React

- Use **TypeScript** for type safety
- Follow **React best practices**
- Use **functional components** with hooks
- **Destructure props** when appropriate
- Use **meaningful variable names**

### Code Style

- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Trailing commas**: Required in multiline structures
- **Line length**: 80-100 characters preferred

### File Naming

- **Components**: PascalCase (`MyComponent.tsx`)
- **Utilities**: camelCase (`myUtility.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Directories**: lowercase with hyphens (`my-feature/`)

### CSS/Styling

- Use **Tailwind CSS** classes
- Avoid custom CSS when possible
- Use **semantic class names** for custom styles
- Follow **mobile-first** responsive design

## Testing

### Manual Testing

- Test your changes in multiple browsers
- Test responsive design on different screen sizes
- Verify accessibility with screen readers when possible
- Test with different data inputs (CSV, JSON, sample data)

### Automated Testing

We encourage adding tests for new features:

- **Unit tests** for utility functions
- **Component tests** for React components
- **Integration tests** for user workflows

## Documentation

### Code Documentation

- **Comment complex logic** and algorithms
- **Document public APIs** and functions
- **Use JSDoc** for TypeScript functions
- **Update type definitions** when needed

### User Documentation

- Update **README.md** for new features
- Add **examples** for new chart types
- Update **configuration guides** when needed
- **Screenshot updates** for UI changes

## Community

### Getting Help

- **GitHub Discussions** for questions and ideas
- **GitHub Issues** for bugs and feature requests
- **GitHub Discussions** for questions and support

### Recognition

We appreciate all contributions! Contributors will be:

- **Acknowledged** in release notes
- **Listed** in the contributors section
- **Thanked** publicly when appropriate

## Development Tips

### Project Structure

Familiarize yourself with the codebase:

- `src/components/` - React components
- `src/services/` - Business logic and utilities
- `src/data/` - Configuration files and sample data
- `src/types/` - TypeScript type definitions

### Adding New Chart Types

1. Create config in `src/data/visualizationTypes/`
2. Add sample data in `src/data/sampleData/`
3. Update code generation in `src/services/CodeGenerator.ts`
4. Add UI components if needed

### Adding New Libraries

1. Update `src/data/libraries.json`
2. Implement code generation logic
3. Add library-specific themes if needed
4. Update documentation

### Debugging

- Use browser DevTools for debugging
- Check console for errors and warnings
- Use React Developer Tools extension
- Test with different data inputs

## Questions?

Don't hesitate to ask questions! We're here to help:

- **GitHub Discussions** for public questions
- **GitHub Issues** for bug reports
- **GitHub Discussions** for contribution questions

Thank you for contributing to DrupalData.dev! 🎉