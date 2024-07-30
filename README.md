# EventSphere

EventSphere is a web application for managing events, including user registration, event creation, payment processing, and more. It is built with React, Vite, and Tailwind CSS, using Supabase for backend services.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Notes on Credentials](#notes-on-credentials)
- [Known Issues](#known-issues)
- [Live Demo](#live-demo)

## Features

- User Authentication with Supabase
- Event Creation and Management
- Payment Processing with Stripe (Test Mode)
- Google Maps Integration
- Google Calendar Integration
- Responsive Design with Light and Dark Modes
- Search and Filter Events
- Support for Business and Regular Users

## Installation

To get started with the project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/munaciella/events-platform
cd events-platform
npm install
```

This command will install all dependencies listed in the `package.json` file, including icons and other packages such as `@radix-ui/react-icons` and `react-icons`.

## Setup

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables. These are required for the application to function correctly:

```env
VITE_SUPABASE_URL=https://vtvytqxwrnuiiofyetvl.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dnl0cXh3cm51aWlvZnlldHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MzkyMTksImV4cCI6MjAzNjExNTIxOX0.X7mjioVOzmJKsxdbTtSTvArevFRhnC4a04cK_u9qWDI

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51PdbGORr09u8cBhFd9C6A3CNJFZsw6A3kb6kUH7HrVRb9XMXsSAmVByqNLbKepEYwrqMi5BzQjZ4fQHJla1YXtNT00SocMFrcL

VITE_GOOGLE_MAPS_API_KEY=AIzaSyCj7zFWVdhFi3t0GdF5kfd6wDENI-Rd7FQ

VITE_GOOGLE_CLIENT_ID=369382567786-phvue04kfo53q22lqku1qab3q1r5a997.apps.googleusercontent.com
```

### Installing dotenv

Ensure `dotenv` is installed to manage environment variables:

```bash
npm install dotenv
```

## Running the Project

To run the project locally, use the following commands:

```bash
npm run dev
```

This will start the development server, and the application will be accessible at `http://localhost:5173`.

## User Registration and Event Creation

Users can sign up to access the site and events. To create an event, users must sign up as a business user by providing a business code during registration. For testing purposes, this business code is set to `2024`.

## Testing

To make a dummy payment using Stripe (in test mode), use the following card details:

- **Success**: `4242 4242 4242 4242`
- **Authentication Required**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

For expiration date, use any future date. For CVC, use any three-digit number, and for the postal code, use any valid ZIP code.

### Browser Configuration for Testing Payments

- **Chrome**:
  1. Go to `chrome://settings/content/insecureContent`.
  2. Add your local development URL (e.g., `http://localhost:5173`) to the "Allow" list.

- **Firefox**:
  1. Go to `about:config`.
  2. Search for `security.mixed_content.block_display_content`.
  3. Set it to `false`.

## Environment Variables

The environment variables used in this project are sensitive and should be kept secure. For testing purposes, these variables have been restricted to specific sites and have limited validity. Ensure to rotate or replace them as necessary in a production environment.

## Notes on Credentials

The provided credentials are for testing purposes only. They are time-limited and restricted to specific sites. It is essential to replace them with production credentials in a live environment and ensure they are secured appropriately.

## Known Issues

- **Google Calendar Integration**: The project is in verification mode. Users will need to click the "Advanced" option during Google login to proceed. No sensitive information is collected.
- **Stripe Blocking**: Stripe may block transactions based on the browser or network configuration. Follow the browser configuration steps provided in the Testing section.

## Live Demo

The project is also available online for testing:

[EventSphere Live Demo](https://event-sphere-web.netlify.app/)