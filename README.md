# Candidate Management Application

This application allows uploading candidates from a frontend and processing them through a backend.

## Project Structure

- `frontend/`: Angular 16+ application with Angular Material using NgModules
- `backend/`: NestJS server to process and serve endpoints

## Features

- Form to upload candidate data (name, surname, Excel file)
- Processing of the Excel file in the backend
- Displaying candidates in a table on the frontend
- Incremental in-memory data storage (for demo)

## Technologies Used

- Angular 16+ with Angular Material (NgModules architecture)
- RxJS for reactive data flow
- NestJS
- Jest for testing (frontend and backend)

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

## Installation

### Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the application in development mode
npm start
```

### Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the application in development mode
npm run start:dev
```

## Usage

1. Open your browser and go to `http://localhost:4200` (frontend)
2. Fill out the form with name and surname.
3. Upload an Excel file with the required columns.
4. Click on the "Submit" button.
5. The data will be processed and displayed in a table on the frontend.

## Excel Format

The Excel file must contain a single row of data (excluding the header) with the following columns:

1. Seniority: must be "junior" or "senior"
2. Years of experience: must be a numeric value
3. Availability: must be a boolean value (true/false)

### Example:

| Seniority | Years of experience | Availability |
| --------- | ------------------- | ------------ |
| senior    | 5                   | true         |

## Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## Development Notes

- Reactive programming with RxJS is applied for data handling
- Data is stored incrementally in memory (for production, a database is recommended)
