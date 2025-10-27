# 🧠 Brain Tumor Detection & Classification System

A web-based AI system that classifies brain MRI scans into different tumor types using AWS Rekognition Custom Labels and provides detailed medical insights.

## 🚀 Features

- **AI-Powered Classification**: Uses AWS Rekognition Custom Labels for accurate tumor detection
- **Multiple Tumor Types**: Classifies Glioma, Meningioma, Pituitary tumors, and No Tumor cases
- **Medical Insights**: Provides detailed symptoms, treatments, and prognosis information
- **User-Friendly Interface**: Drag & drop MRI upload with real-time analysis
- **Secure & Scalable**: Built on AWS serverless architecture

## 🏥 Supported Tumor Types

| Tumor Type | Description | Severity |
|------------|-------------|----------|
| **Glioma** | Aggressive tumors from glial cells (50.4% of primary brain tumors) | High - Malignant |
| **Meningioma** | Benign tumors from brain coverings (20.8% of cases) | Low to Moderate |
| **Pituitary** | Benign growths in pituitary gland (15% of cases) | Low to Moderate |
| **No Tumor** | Healthy brain MRI scan | None |

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript** - Responsive web interface
- **Drag & Drop API** - Easy image upload
- **Fetch API** - HTTP requests to backend

### Backend
- **AWS Lambda** - Serverless compute
- **API Gateway** - REST API endpoints
- **AWS Rekognition Custom Labels** - AI/ML model for image classification
- **Amazon S3** - Dataset storage
- **IAM** - Security and permissions

## 📁 Project Structure

brain-tumor-detection-ai/
├── frontend/
│   ├── index.html              # Main application UI
│   ├── app.js                  # Frontend logic and API integration
│   ├── styles.css              # Styling for the web interface
│   └── assets/                 # Images, icons, and other static resources
│
├── backend/
│   ├── lambda/
│   │   └── classifier.py       # AWS Lambda function for image classification
│   └── api-gateway/            # API Gateway configuration files
│
├── dataset/
│   ├── glioma/                 # Training images for Glioma category
│   ├── meningioma/             # Training images for Meningioma category
│   ├── pituitary/              # Training images for Pituitary category
│   └── notumor/                # Training images for Non-tumor images
│
├── docs/
│   └── setup-guide.md          # Step-by-step deployment and setup guide
│
└── README.md                   # Project overview and documentation


## 📊 Model Evaluation Results

F1 Score: 0.998

Average Precision: 0.998

Overall Recall: 0.997

## 🧠 Dataset Information

Training Dataset: 4 labels, 5,617 images

Testing Dataset: 4 labels, 1,406 images

## 🕒 Training Details

Date Completed: October 25, 2025

Training Duration: 5.656 hours