# DrupalDataDotDev

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://www.drupaldata.dev/)
[![CivicTech](https://img.shields.io/badge/Civic-Tech-1f7a8c)](https://github.com/brianfunk/DrupalDataDotDev)
[![Built by MetaPhase](https://img.shields.io/badge/Built%20by-MetaPhase-fb641f)](https://metaphase.tech)
[![LinkedIn](https://img.shields.io/badge/Linked-In-0077b5)](https://www.linkedin.com/company/metaphase-consulting-llc/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/04264f9f-bc5a-4b8a-af04-6dd613d67f7f/deploy-status)](https://app.netlify.com/projects/drupaldatadotdev/deploys)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Security](https://img.shields.io/badge/Security-SOC%202-blue)](https://netlify.com/security)

**Free, fast, Drupal data visualization generator.** Create beautiful charts and maps from JSON, CSV, or manual input with Chart.js, Highcharts, ECharts, and more. Generate ready-to-use code for Drupal modules, blocks, controllers, or standalone HTML files.

![DrupalDataDotDev Generator Interface](public/drupaldatadotdev-logo.png)

## ✨ Features

- **Multiple Chart Libraries**: Support for Chart.js, Highcharts, ECharts, D3.js, and more
- **Flexible Data Input**: Upload CSV files, paste JSON data, or use built-in sample datasets
- **Visualization Types**: Bar charts, line charts, pie charts, maps, radar charts, statistical plots, and more
- **Multiple Output Formats**: 
  - Raw JavaScript code
  - Drupal block plugins
  - Drupal controllers with routes
  - Complete Drupal modules (ZIP download)
  - Standalone HTML files
- **Theme System**: Pre-built themes including Drupal Night, Light themes, and custom styling options
- **Responsive Design**: Mobile-friendly interface with dark/light mode support
- **Accessibility**: WCAG 2.1 AA compliant interface
- **Security**: Built-in XSS protection and input sanitization

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brianfunk/DrupalDataDotDev.git
   cd DrupalDataDotDev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📖 Usage Guide

### 1. Choose Visualization Type
Select from various chart types including:
- **Bar Charts**: Vertical, horizontal, stacked, grouped
- **Line Charts**: Simple, multi-series, area charts
- **Pie Charts**: Standard pie, donut, semi-donut
- **Maps**: Choropleth, bubble maps, heat maps
- **Statistical**: Box plots, histograms, scatter plots
- **Specialized**: Radar charts, treemaps, sankey diagrams

### 2. Configure Options
Customize your visualization with:
- Chart subtypes and styling options
- Color schemes and themes
- Animation settings
- Responsive behavior

### 3. Select Library
Choose the best charting library for your needs:
- **Chart.js**: Great for simple, responsive charts
- **Highcharts**: Feature-rich with excellent documentation
- **ECharts**: Powerful for complex visualizations
- **D3.js**: Maximum customization and flexibility

### 4. Input Your Data
Multiple data input methods:
- **CSV Upload**: Drag and drop or select CSV files (max 10MB)
- **JSON Input**: Paste JSON data directly
- **Sample Data**: Use built-in datasets for testing

### 5. Generate Code
Download code in your preferred format:
- Raw JavaScript for custom implementations
- Drupal block plugins for easy integration
- Complete Drupal modules with routing
- Standalone HTML files for quick deployment

## 🏗 Project Structure

```
├── public/                 # Static assets
│   ├── favicon.ico        # Favicon and icons
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # Search engine directives
├── src/
│   ├── components/        # React components
│   │   ├── generator/     # Generator-specific components
│   │   ├── Header.tsx     # Site header
│   │   └── Footer.tsx     # Site footer
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── data/              # Configuration and sample data
│   │   ├── chartStyles.json    # Theme definitions
│   │   ├── chartTypes.json     # Chart type configurations
│   │   ├── libraries.json      # Supported libraries
│   │   ├── sampleData/         # Sample datasets
│   │   └── visualizationTypes/ # Visualization configs
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Landing page
│   │   ├── Generator.tsx  # Main generator interface
│   │   └── About.tsx      # About page
│   ├── services/          # Business logic
│   │   ├── CodeGenerator.ts    # Code generation logic
│   │   └── DefaultConfig.ts    # Default configurations
│   ├── types/             # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Adding New Chart Types

1. Create configuration file in `src/data/visualizationTypes/`
2. Add sample data in `src/data/sampleData/`
3. Update the visualization types index
4. Implement code generation logic in `CodeGenerator.ts`

### Adding New Themes

1. Add theme definition to `src/data/chartStyles.json`
2. Include color palettes and styling options
3. Update theme selector component

### Code Quality

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting (recommended)
- **Accessibility** testing with built-in WCAG compliance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🔒 Security

Security is important to us. Please review our [Security Policy](SECURITY.md) for information on reporting vulnerabilities.

Key security features:
- Input sanitization and XSS protection
- File upload validation and size limits
- CSP headers for additional protection
- Regular dependency updates

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** - Simple yet flexible JavaScript charting
- **Highcharts** - Professional charting library
- **ECharts** - Powerful charting and visualization library
- **React** - User interface framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## 📞 Support

- **Documentation**: Check our [Wiki](../../wiki) for detailed guides
- **Issues**: Report bugs or request features via [GitHub Issues](../../issues)
- **Discussions**: Join conversations in [GitHub Discussions](../../discussions)
- **Email**: For private inquiries, contact [support@drupaldatadotdev](mailto:support@drupaldatadotdev)

## 🗺 Roadmap

- [ ] Add more visualization libraries (Plotly, Observable Plot)
- [ ] Implement real-time data preview
- [ ] Add collaboration features
- [ ] Create VS Code extension
- [ ] Add API for programmatic access
- [ ] Mobile app for on-the-go chart creation

---

**Built with ❤️ for the Drupal community**

[Website](https://www.drupaldata.dev) • [Issues](../../issues) • [Contributing](CONTRIBUTING.md) • [Changelog](CHANGELOG.md)