# Customer Management System - Frontend

A React based customer management application that allows you to create, edit and view customer records with multiple mobile numbers and addresses.


## Features

- **Customer Management**
  - Create new customers with form validation
  - View all customers in a responsive table
  - Edit existing customer information
  - Search customers by name or NIC

- **Dynamic Form Fields**
  - Add/remove multiple mobile numbers dynamically
  - Add/remove multiple addresses dynamically
  - Real time form validation
  - Error messages for invalid inputs

- **Data Handling**
  - Proper payload structure matching backend requirements
  - Automatic data cleanup (removes empty entries)
  - Loading states during API calls
  - Success/error notifications

- **Excel Upload**
  - Bulk customer upload via Excel files
  - Support for .xlsx and .xls formats

- **User Experience**
  - Responsive design for mobile and desktop
  - Clean and modern UI
  - Disabled NIC field during edit
  - Cancel confirmation dialog

## Tech Stack

- **React 18** - UI library
- **React Router DOM 6** - Routing and navigation
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling (no external libraries)
- **React Hooks** - State management (useState, useEffect)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) or **yarn** - Comes with Node.js
- **Git** (optional)

## Installation

### Using Git 

```bash
# Clone the repository
git clone https://github.com/yourusername/customer-management-frontend.git

# Navigate to project directory
cd customer-management-frontend

# Install dependencies
npm install

# Start the application
npm run dev