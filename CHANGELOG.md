# Changelog

## [1.0.0] - 2026-01-10

### Added
- Stable core architecture for production usage
- Custom terminal user interface with responsive three-panel layout
- Real-time streaming of model responses
- Markdown rendering engine supporting headers, lists, tables, code blocks, and syntax highlighting for multiple languages
- Support for Anthropic, OpenAI, and Groq API providers
- Configuration management system with dedicated CLI commands
- Proper terminal state management (alternate screen buffer, clean exit)
- Complete CHANGELOG.md documenting project history


## [0.1.1] - 2026-01-08

### Changed
- Renamed primary entry point from `cli.js` to `main.js`
- Removed deprecated CommonJS remnants
- Cleaned up unused configuration files
- Improved overall project structure and code organization

### Fixed
- Corrected installation instructions in README.md

## [0.1.0] - 2025-12-31

### Added
- Initial project structure and modular architecture
- Custom terminal UI with header, main content, and input areas
- Responsive layout system with automatic recalculation on terminal resize
- Markdown rendering pipeline including syntax highlighting (via cli-highlight)
- Provider abstraction layer for Anthropic, OpenAI, and Groq
- Basic configuration persistence infrastructure
- Comprehensive documentation (README.md)
- MIT license
- Standard project files (.gitignore, .env.example)