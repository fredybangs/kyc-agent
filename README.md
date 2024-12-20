
## Introduction

The **KYC Agent App** is a mobile application designed to simplify and enhance the process of handling Know Your Customer (KYC) applications. It enables agents to create, manage, and submit KYC applications efficiently, with robust offline support for data collection in areas with limited connectivity.

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## Features

### 1. **Authentication**
- Secure login functionality allowing agents to sign in using **email** or **phone numbers**.
- Supports session-based authentication to ensure secure access.
- Provides user-friendly error messages for incorrect credentials.

### 2. **Welcome Page**
- Displays a **welcome screen** with instructions and guidelines for agents.
- Includes a "Get Started" button that navigates to the login page.

### 3. **KYC Application Creation**
- Agents can **create new KYC applications** with the following details:
  - Customer name, phone number, email, and address (current and permanent).
  - ID details such as ID type, number, expiration date, and document uploads.
  - Selfie for identity verification.
- Validates critical fields such as phone numbers and email formats.
- Offline-saving functionality allows agents to save applications locally for later submission.

### 4. **Offline Applications Management**
- View and manage **offline KYC applications** saved locally.
- Submit offline applications when an internet connection is available.
- Ability to delete saved applications with a confirmation prompt.

### 5. **Submitted Applications**
- Displays a list of **submitted KYC applications** fetched from the server.
- Shows detailed information for each application, including:
  - Customer name, phone number, state, and verification notes.
- Refresh functionality to update the application list with the latest data.

### 6. **Image Upload**
- Supports capturing or selecting images for:
  - ID documents.
  - Proof of address.
  - Selfie for verification.
- Images are uploaded to an external service (e.g., **ImgBB**) and processed securely.
- Handles Base64 image encoding and uploads.

### 7. **Real-Time Sync**
- Automatically syncs offline applications when the device reconnects to the internet.
- Ensures data integrity and provides success/error notifications for each operation.

### 8. **Activity Indicators**
- Displays **loading indicators** during:
  - Data submissions.
  - Image uploads.
  - Offline-to-online synchronization.

### 9. **Dynamic Navigation**
- Easy navigation between app sections, including:
  - Welcome page.
  - Login.
  - Create KYC Application.
  - Offline Applications.
  - Submitted Applications.

---

## User Guide

### Getting Started
1. Open the app.
2. On the **Welcome Page**, click **Get Started** to navigate to the login screen.
3. Sign in using your **email/phone number** and password.

### Creating KYC Applications
1. Navigate to the **Create Application** section.
2. Fill in the required fields, including customer details and address.
3. Upload required documents (ID, proof of address, selfie) using the camera or gallery.
4. Submit the application or save it offline for later synchronization.

### Managing Offline Applications
1. Access **Offline Applications** from the menu.
2. Review saved applications.
3. Submit saved applications when online or delete them if not needed.

### Viewing Submitted Applications
1. Go to the **Submitted Applications** section.
2. View all submitted applications with their current state and verification notes.
3. Use the refresh feature to get the latest updates from the server.

---

## Technical Highlights

### Validation
- **Phone Numbers**: Normalizes formats to a consistent standard for accurate searches.
- **Email Addresses**: Ensures email input adheres to valid formats.
- Comprehensive field validation prevents incomplete or incorrect submissions.

### API Integration
- Uses secure RESTful APIs for:
  - Fetching submitted KYC applications.
  - Uploading new applications.
  - Syncing offline data.
- Handles network errors gracefully, displaying alerts for connectivity issues.

### Redux Integration
- Manages:
  - User sessions.
  - Offline applications.
  - Application state across components.
- Ensures seamless data flow and state management throughout the app.

### External Services
- Integrates with **ImgBB** for image uploads and processing.
- Securely uploads Base64-encoded images for ID verification.

---

## Key Components

### Screens
1. **WelcomeScreen**: Provides an overview and navigates to the login page.
2. **LoginScreen**: Allows agents to log in using email or phone.
3. **CreateApplicationScreen**: A form for creating and submitting new KYC applications.
4. **OfflineApplicationsScreen**: Manages saved offline applications.
5. **SubmittedApplicationsScreen**: Displays submitted applications fetched from the server.

### Utilities
1. **Validation**: Functions for phone number normalization and email validation.
2. **Image Handling**: Methods for capturing, uploading, and processing images.
3. **API Services**: Handles secure communication with the backend.

---

## Future Enhancements
1. **Push Notifications**: Notify agents of application updates or status changes.
2. **Multi-language Support**: Extend usability to non-English-speaking users.
3. **Analytics Dashboard**: Provide insights into application submissions and success rates.

---

## Conclusion
The **KYC Agent App** is a powerful tool for agents to streamline customer onboarding and KYC processes. Its offline capabilities, robust image handling, and real-time synchronization make it indispensable for agents working in dynamic environments.
