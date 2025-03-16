# QNXtainer Studio

A container management tool for QNX systems, built with React, Electron, and Shadcn UI components.

## Features

- Container dashboard for monitoring and management
- Container creation wizard
- Resource monitoring and visualization
- Process isolation using POSIX mechanisms

## Tech Stack

- **Frontend**: React + Electron
- **UI Components**: Shadcn UI + Tailwind CSS
- **Backend**: Node.js with C/C++ native modules for QNX integration (planned)

## Development

### Prerequisites

- Node.js 16+
- QNX SDP 8.0 (for QNX-specific functionality)

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Launch the Electron app in development mode:
   ```
   npm run electron-dev
   ```

### Building

To build the application:

```
npm run electron-build
```

## Project Structure

- `src/` - React application source code
- `electron/` - Electron main process code
- `public/` - Static assets
- `api_client/` - API client for QNX container management

## License

MIT

## Acknowledgements

- QNX is a registered trademark of BlackBerry Limited
- This project is not officially affiliated with QNX Software Systems Limited or BlackBerry Limited
