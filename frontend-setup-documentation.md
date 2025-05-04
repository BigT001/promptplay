# Frontend Setup Documentation

This document explains how the frontend setup works, how the components interact, and how you can use it to build pages, components, and dashboards.

---

## 1. **Project Structure**

The frontend project is organized as follows:

```plaintext
frontend/
├── app/                  # Next.js App Router
├── pages/                # Next.js Pages Router
├── components/           # Reusable UI components
│   └── ui/               # UI-specific components
├── public/               # Static assets (images, fonts)
├── lib/                  # Utility functions and hooks
├── styles/               # Global and component-specific styles
├── tailwind.config.js    # Tailwind CSS configuration
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
frontendDevAgt/       # Frontend Developer Agent configuration
│   ├── design-tokens.json      # Design System Tokens
│   └── continue-config.json    # MCP Agent Config
```

---

## 2. **Key Components**

### a. **Design Tokens**

The `design-tokens.json` file defines the design system for the project, including:
- Colors
- Fonts
- Spacing
- Border radius
- Shadows

These tokens are integrated into Tailwind CSS via the `tailwind.config.js` file, allowing you to use them throughout your project.

### b. **MCP Agent**

The Model-Component-Prompt (MCP) agent is configured in `continue-config.json`. It provides the following keybindings:
- **Ctrl + Alt + M**: Triggers the MCP agent to design a beautiful UI component based on the current file context.
- **Ctrl + Alt + S**: Saves the current design.

The `triggerMCP.js` script simulates these actions programmatically.

### c. **Tailwind CSS**

Tailwind CSS is configured in `tailwind.config.js` to extend the theme using the design tokens. This ensures consistency across the project.

---

## 3. **How It Works Together**

1. **Design Tokens Integration**:
   - The design tokens are imported into `tailwind.config.js` to extend the Tailwind theme.
   - You can use these tokens in your components and pages for consistent styling.

2. **MCP Agent Actions**:
   - The MCP agent can dynamically add components to your pages or save designs based on the keybindings or the `triggerMCP.js` script.

3. **Reusable Components**:
   - Place reusable components in the `components/ui/` directory.
   - Use these components in your pages or dashboards.

4. **Next.js App Router**:
   - Use the `app/` directory to define your pages and layouts.
   - The `page.tsx` file serves as the entry point for the home page.

---

## 4. **Building Pages, Components, and Dashboards**

### a. **Creating a New Page**

1. Add a new folder in the `app/` directory (e.g., `app/dashboard`).
2. Create a `page.tsx` file inside the folder.
3. Use the design tokens and reusable components to build your page.

Example:
```tsx
import React from 'react';

export default function Dashboard() {
  return (
    <div className="bg-background text-textPrimary p-4">
      <h1 className="text-3xl font-heading">Dashboard</h1>
      <p className="text-base font-body">Welcome to your dashboard!</p>
    </div>
  );
}
```

### b. **Creating a New Component**

1. Add a new file in the `components/ui/` directory (e.g., `Button.tsx`).
2. Define your component using TypeScript and Tailwind CSS.

Example:
```tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

### c. **Building a Dashboard**

1. Create a new page in the `app/` directory (e.g., `app/dashboard`).
2. Use reusable components and design tokens to build the dashboard layout.

Example:
```tsx
import React from 'react';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  return (
    <div className="bg-background text-textPrimary p-4">
      <h1 className="text-3xl font-heading">Dashboard</h1>
      <Button label="Click Me" onClick={() => alert('Button clicked!')} />
    </div>
  );
}
```

---

## 5. **Running the Project**

1. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 6. **Saving Output**

To save the output of your designs:
1. Use the `Ctrl + Alt + S` keybinding to save the current design.
2. Alternatively,node triggerMCP.js` script to simulate saving the design:
   ```bash
   node frontendDevAgt/triggerMCP.js
   ```

---

This setup provides a robust foundation for building scalable and maintainable frontend applications. Let me know if you need further assistance!
