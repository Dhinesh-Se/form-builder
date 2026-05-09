# ⚡ Form Builder

A modern, highly customizable, and interactive drag-and-drop Form Builder built with Angular 16. This application allows users to visually design forms and instantly export them as production-ready code for **Angular**, **React**, or **Vanilla HTML/JS**.

## ✨ Features

- **🎨 Visual Canvas & Live Preview**: Add, remove, and reorder fields in real-time. See exactly what your form will look like as you build it.
- **⚙️ Deep Customization**: Edit properties for each form field including labels, placeholders, help text, required status, and multi-choice options.
- **🌈 Theming Engine**: Customize the look and feel of your forms using the global theme configuration (colors, font sizes, border radii, etc.).
- **💾 Auto-Save / Persistence**: Your progress is automatically saved to local storage. You can refresh or close the tab without losing your work!
- **📦 Multi-Framework Code Export**:
  - **Angular**: Generates template (HTML), styles (CSS), and component class (TS) using `ngModel` for two-way binding.
  - **React**: Generates a functional component (JSX) using `useState` hooks and styles (CSS).
  - **Vanilla HTML/JS**: Generates standard HTML5 forms using `FormData` and native JavaScript.
- **⬇️ Download as Folder**: Export your finished forms as a `.zip` file containing a perfectly structured, drag-and-drop ready folder for your framework of choice.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and the Angular CLI installed on your machine.

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd form-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200/`.

## 🛠️ Tech Stack

- **Framework**: Angular 16 (Standalone Components)
- **Styling**: Vanilla CSS with CSS Variables for theming
- **State Management**: Angular Signals
- **File Export**: JSZip & FileSaver.js

## 📝 How to Use

1. **Build**: Use the sidebar on the left to add fields (Text, Email, Textarea, Select, Radio, Checkbox, etc.) to your form.
2. **Edit**: Click on any field on the canvas to open its properties on the right sidebar. You can rename the field, mark it as required, or edit its options.
3. **Theme**: Use the "Theme" tab on the right sidebar to adjust the visual design (colors, fonts, sizes).
4. **Export**: Click the "⚡ Export Code" button on the top right. Select your preferred framework (Angular, React, or Vanilla) and either copy the code snippets or click **📦 Download Folder** to get everything in a `.zip` package.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
