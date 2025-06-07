# FAQ AI Generator 🤖

An intelligent FAQ section generator powered by Google Gemini AI that creates customized FAQ content for your website or business.

## ✨ Features

### 🎯 Smart FAQ Generation
- **AI-Powered**: Utilizes Google Gemini API for intelligent FAQ generation
- **Customizable Inputs**: 
 - Website URL or text file information
 - Product/company description
 - Tone selection (professional, casual, friendly, etc.)
 - Custom keywords to include
- **Context-Aware**: Generates relevant questions and answers based on your specific content

### 👤 User Management
- **Secure Authentication**: Powered by Supabase Auth
- **Credit System**: 
 - Free tier: 5 credits (5 FAQ generations)
 - Paid tier: 20 credits with daily reset
- **User Dashboard**: 
 - Profile picture customization
 - Account information management
 - Password reset functionality
 - Account deletion option

### 🎨 Visual Customization
- **Interactive Editor**: Customize FAQ appearance and layout
- **Smart Suggestions**: Add contextually relevant questions using Gemini AI
- **Real-time Preview**: See changes as you make them

### 📤 Export Options
- **HTML**: Ready-to-embed code for your website
- **PDF**: Professional document format
- **Text**: Plain text format for easy copying

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing
- **Flexible Billing**: Upgrade to paid tier for increased credits
- **Daily Credit Reset**: Paid users get fresh credits every day

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Authentication & Database**: Supabase
- **AI Processing**: Google Gemini API
- **API Routes**: Firebase Functions
- **Payment Processing**: Stripe
- **Styling**: Tailwind CSS (assumed)

## 📋 Usage

### For Users

1. **Sign Up/Login**: Create an account or login to access the FAQ generator
2. **Generate FAQ**: 
  - Enter your website URL or upload a text file
  - Provide a description of your product/company
  - Select the desired tone
  - Add relevant keywords
  - Click generate to create your FAQ
3. **Customize**: Use the visual editor to modify appearance and add questions
4. **Export**: Download your FAQ in HTML, PDF, or text format

### Credit System

- **Free Users**: 5 credits upon registration
- **Paid Users**: 20 credits with daily reset at midnight UTC
- Each FAQ generation consumes 1 credit

### Dashboard Features

- **Profile Management**: Update profile picture and account information
- **Password Reset**: Securely reset your password
- **Account Deletion**: Permanently delete your account and data
- **Credit Monitor**: Track your remaining credits and usage history

### FAQ Generation Process

1. **Input Content**: 
  - Paste your website URL for automatic content extraction
  - Or upload a text file with relevant information
  
2. **Customize Parameters**:
  - **Description**: Describe your product, service, or company
  - **Tone**: Choose from professional, casual, friendly, technical, or conversational
  - **Keywords**: Add specific terms you want included in the FAQ
  
3. **Generate & Review**: AI creates contextually relevant Q&A pairs based on your inputs

4. **Visual Customization**:
  - Modify FAQ styling and layout
  - Add or remove questions
  - Edit answers to match your brand voice
  - Use AI suggestions for additional relevant questions

5. **Export Options**:
  - **HTML**: Copy-paste ready code for your website
  - **PDF**: Professional document for sharing or printing
  - **Text**: Plain format for easy integration

### Subscription Management

- **Free Tier**: 5 credits total (no renewal)
- **Paid Tier**: 20 credits with daily reset
- **Billing**: Managed through Stripe with secure payment processing
- **Cancellation**: Cancel anytime through your dashboard
