# Profit Pilot - A Next.js Application

This application was bootstrapped in Firebase Studio. It's a Next.js project with TypeScript, Tailwind CSS, and ShadCN UI components.

## Getting Started

To run this project on your local machine, please follow these steps:

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Running the App

1. **Download the code:**
   Download all the project files to your local machine.

2. **Navigate to the project directory:**
   Open your terminal or command prompt and change the directory to where you saved the project.
   ```bash
   cd path/to/your/project
   ```

3. **Install dependencies:**
   Run the following command to install all the necessary packages defined in `package.json`.
   ```bash
   npm install
   ```

4. **Run the development server:**
   Once the installation is complete, start the development server.
   ```bash
   npm run dev
   ```

5. **View the application:**
   Open your web browser and navigate to [http://localhost:9002](http://localhost:9002). You should see the application running.

## Key Files

- **`src/app/page.tsx`**: The main page component of the application.
- **`src/components/profit-pilot/ProfitPilotPage.tsx`**: The core component containing all the UI and logic for the Profit Pilot tool.
- **`src/ai/flows/`**: Contains the Genkit AI flows used for generating UI titles and other AI-powered features.
- **`src/app/globals.css`**: The main stylesheet, including Tailwind CSS and custom styles for the application's theme.
