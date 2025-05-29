
# Welcome to your Dan Mititi Project

## Project info

## Is just for my university 

## Technologies Used

This project is built with the following technologies and versions:

### Core Framework & Build Tools
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** ^18.3.1 - UI library
- **React DOM** ^18.3.1 - React DOM rendering

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built using Radix UI and Tailwind CSS
- **Tailwind Merge** ^2.5.2 - Utility for merging Tailwind CSS classes
- **Tailwindcss Animate** ^1.0.7 - Animation utilities for Tailwind CSS
- **Class Variance Authority** ^0.7.1 - Creating variant APIs
- **clsx** ^2.1.1 - Utility for constructing className strings

### Radix UI Components
- **@radix-ui/react-accordion** ^1.2.0
- **@radix-ui/react-alert-dialog** ^1.1.1
- **@radix-ui/react-aspect-ratio** ^1.1.0
- **@radix-ui/react-avatar** ^1.1.0
- **@radix-ui/react-checkbox** ^1.1.1
- **@radix-ui/react-collapsible** ^1.1.0
- **@radix-ui/react-context-menu** ^2.2.1
- **@radix-ui/react-dialog** ^1.1.2
- **@radix-ui/react-dropdown-menu** ^2.1.1
- **@radix-ui/react-hover-card** ^1.1.1
- **@radix-ui/react-label** ^2.1.0
- **@radix-ui/react-menubar** ^1.1.1
- **@radix-ui/react-navigation-menu** ^1.2.0
- **@radix-ui/react-popover** ^1.1.1
- **@radix-ui/react-progress** ^1.1.0
- **@radix-ui/react-radio-group** ^1.2.0
- **@radix-ui/react-scroll-area** ^1.1.0
- **@radix-ui/react-select** ^2.1.1
- **@radix-ui/react-separator** ^1.1.0
- **@radix-ui/react-slider** ^1.2.0
- **@radix-ui/react-slot** ^1.1.0
- **@radix-ui/react-switch** ^1.1.0
- **@radix-ui/react-tabs** ^1.1.0
- **@radix-ui/react-toast** ^1.2.1
- **@radix-ui/react-toggle** ^1.1.0
- **@radix-ui/react-toggle-group** ^1.1.0
- **@radix-ui/react-tooltip** ^1.1.4

### Backend & Authentication
- **Supabase** - Backend as a Service
- **@supabase/supabase-js** ^2.49.4 - Supabase JavaScript client
- **@supabase/auth-helpers-react** ^0.5.0 - Supabase auth helpers for React
- **@supabase/auth-ui-react** ^0.4.7 - Pre-built auth components
- **@supabase/auth-ui-shared** ^0.1.8 - Shared utilities for auth UI

### Email Services
- **Resend** - Email delivery service for order confirmations and notifications

### State Management & Data Fetching
- **@tanstack/react-query** ^5.56.2 - Powerful data synchronization for React

### Routing
- **React Router DOM** ^6.26.2 - Declarative routing for React

### Forms & Validation
- **React Hook Form** ^7.53.0 - Performant forms with easy validation
- **@hookform/resolvers** ^3.9.0 - Validation resolvers for React Hook Form
- **Zod** ^3.23.8 - TypeScript-first schema validation

### UI Enhancements
- **Lucide React** ^0.462.0 - Beautiful & consistent icon toolkit
- **Recharts** ^2.12.7 - Composable charting library
- **Next Themes** ^0.3.0 - Perfect dark mode in 2 lines of code
- **Sonner** ^1.5.0 - An opinionated toast component
- **Vaul** ^0.9.3 - Unstyled, accessible components for building high‑quality design systems
- **React Day Picker** ^8.10.1 - Date picker component
- **Date-fns** ^3.6.0 - Modern JavaScript date utility library
- **Embla Carousel React** ^8.3.0 - Carousel library
- **Input OTP** ^1.2.4 - One-time password input component
- **React Resizable Panels** ^2.1.3 - Resizable panel components
- **cmdk** ^1.0.0 - Fast, composable, unstyled command menu

## Database Setup

To set up the database for this project:

1. Navigate to the SQL Editor in your Supabase project
2. Copy the SQL from `supabase/migrations/create_profiles_table.sql`
3. Paste it into the SQL Editor and run it
4. This will create all necessary tables and set up authentication

## How can I edit this code?

There are several ways of editing your application.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.
