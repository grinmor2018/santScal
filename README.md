# Candidate Management Application

This application allows uploading candidates from a frontend and processing them through a backend.

## Project Structure

- `frontend/`: Angular 16+ application with Angular Material
- `backend/`: NestJS server to process the information

## Features

- Form to upload candidate data (name, surname, Excel file)
- Processing of the Excel file in the backend
- Displaying candidates in a table
- Incremental data storage

## Technologies Used

- Angular 16+ with Angular Material
- Reactive Forms
- NestJS
- Standalone components
- Functional and reactive programming
- Jest for testing

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

1. Open your browser and go to `http://localhost:4200`
2. Fill out the form with name and surname
3. Upload an Excel file with the required columns:
   - Seniority (junior | senior)
   - Years of experience (number)
   - Availability (boolean)
4. Submit the form
5. View the results in the table

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

- The application uses Angular standalone components for better modularity
- Reactive programming with RxJS is applied for data handling
- Data is stored incrementally in memory (for production, a database is recommended)
