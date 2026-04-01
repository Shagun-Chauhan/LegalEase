# LegalEase - AI-Powered Legal Document Analyzer

## Overview

LegalEase is a full-stack web application that allows users to upload legal documents (PDF, DOCX, TXT), analyzes them using Google's Gemini AI, and stores the results in MongoDB Atlas. The application provides simplified legal analysis including document summaries, key points, risk assessment, and process predictions.

## Features

- **Document Upload**: Support for PDF, DOCX, and TXT files (up to 15MB)
- **AI Analysis**: Google Gemini API integration for legal document analysis
- **MongoDB Storage**: Secure storage of analysis results in MongoDB Atlas
- **User Interface**: Clean, responsive web interface for upload and results viewing
- **Error Handling**: Comprehensive error handling and logging
- **Connection Management**: Robust MongoDB connection with retry logic

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - MongoDB object modeling
- **Google Gemini API** - AI analysis
- **Multer** - File upload handling
- **PDF-parse** - PDF text extraction
- **Mammoth** - DOCX text extraction

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Interactivity

## Project Structure

```
LegalEase/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   └── documentController.js # Main API logic
│   ├── middleware/
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   └── Document.js           # MongoDB schema
│   ├── routes/
│   │   └── documentRoutes.js     # API routes
│   ├── services/
│   │   ├── aiService.js          # Gemini API integration
│   │   ├── documentParser.js     # Text extraction
│   │   └── predictorService.js   # Risk level prediction
│   ├── utils/
│   │   └── textExtractor.js      # Text processing utilities
│   ├── uploads/                  # Temporary file storage
│   ├── .env                      # Environment variables (create from .env-example)
│   ├── .env-example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Main server file
├── frontend/
│   ├── index.html                # Home page
│   ├── upload.html               # Document upload page
│   ├── results.html              # Results display page
│   ├── app.js                    # Frontend JavaScript
│   └── styles.css                # Styling
├── package.json                  # Root dependencies
└── README.md                     # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Google AI Studio account (for Gemini API key)

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd "LegalEase Project/LegalEase"

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Navigate back to root
cd ..
```

### 2. Environment Configuration

1. Copy the environment template:
```bash
cd backend
cp .env-example .env
```

2. Edit the `.env` file with your credentials:

```env
# Google AI Studio: Get your API key from https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Atlas: Get connection string from MongoDB Atlas dashboard
# Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/legalease?retryWrites=true&w=majority
MONGODB_URI=your_mongodb_connection_string_here

PORT=5001

# Optional: Specify Gemini model
GEMINI_MODEL=gemini-1.5-flash-latest
```

### 3. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" → "Connect your application"
5. Add your IP address to the whitelist (0.0.0.0/0 for development)

### 4. Google Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy the API key to your `.env` file

## Running the Application

### Start the Server

```bash
cd backend
npm start
```

The server will start on `http://localhost:5001` by default.

### Access the Application

- **Home Page**: http://localhost:5001
- **Upload Document**: http://localhost:5001/upload.html
- **View Results**: http://localhost:5001/results.html
- **API Health Check**: http://localhost:5001/

## API Endpoints

### GET `/`
Health check endpoint that returns API status and available endpoints.

### POST `/api/documents/upload`
Upload and analyze a legal document.

**Request**: `multipart/form-data`
- `document`: File (PDF, DOCX, or TXT, max 15MB)

**Response**: 
```json
{
  "success": true,
  "id": "document_id",
  "originalFileName": "document.pdf",
  "uploadedAt": "2024-01-01T00:00:00.000Z",
  "documentSummary": "Document summary...",
  "keyPoints": "• Key point 1\n• Key point 2",
  "legalProcessType": "Contract Dispute",
  "estimatedTime": "3-6 months",
  "estimatedCost": "$5,000-$15,000",
  "successProbability": "60-75% (moderate)",
  "riskAnalysis": "Risk analysis...",
  "riskLevel": "Medium"
}
```

### GET `/api/documents`
List recent document analyses.

**Response**:
```json
{
  "documents": [
    {
      "id": "document_id",
      "originalFileName": "document.pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "legalProcessType": "Contract Dispute",
      "riskLevel": "Medium"
    }
  ]
}
```

### GET `/api/documents/:id`
Get a specific document analysis by ID.

**Response**: Same format as upload endpoint response.

## Error Handling

The application includes comprehensive error handling:

- **File Upload Errors**: Invalid file types, oversized files
- **Database Errors**: Connection failures, invalid data
- **AI API Errors**: Network issues, invalid responses
- **Server Errors**: General error handling with logging

All errors are logged to the console with timestamps and relevant context.

## Development Notes

### MongoDB Connection
The application uses robust MongoDB connection handling with:
- Automatic retry logic
- Connection event listeners
- Graceful shutdown handling
- Connection pooling

### AI Integration
The Gemini API integration includes:
- Multiple model fallbacks
- Retry logic for transient errors
- JSON response parsing with validation
- Comprehensive error handling

### File Processing
Document processing includes:
- Text extraction from PDF, DOCX, and TXT
- Content validation and cleaning
- Temporary file cleanup
- File size and type validation

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MONGODB_URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

2. **Gemini API Error**
   - Verify your GEMINI_API_KEY is valid
   - Check if you have API quota remaining
   - Ensure model name is correct

3. **File Upload Error**
   - Check file size (max 15MB)
   - Verify file type (PDF, DOCX, TXT only)
   - Ensure uploads directory exists and is writable

4. **Port Already in Use**
   - Server will automatically try next port if 5001 is busy
   - Or specify different PORT in .env file

### Debug Mode

Enable additional logging by setting:
```env
DEBUG=legalease:*
```

## Production Deployment

For production deployment:

1. Set environment variables for production
2. Use HTTPS
3. Configure proper CORS settings
4. Set up proper logging
5. Configure rate limiting
6. Use proper file storage (not local filesystem)

## Security Considerations

- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- Implement rate limiting in production
- Validate all user inputs
- Use HTTPS in production
- Regularly update dependencies

## License

This project is for educational and demonstration purposes only. Not legal advice.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs for error details
3. Verify all environment variables are set correctly
4. Ensure all prerequisites are met
