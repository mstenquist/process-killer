# Process Killer 💀

A beautiful and intuitive web application for monitoring and managing development ports. Perfect for developers who work with multiple services and need a quick way to see what's running where and kill processes when needed.

## Features

- 🚀 **Real-time Port Monitoring** - Monitor common development ports (3000-3005, 9000+)
- 💀 **One-Click Process Killing** - Kill processes directly from the web interface
- 🔄 **Auto-Refresh** - Optional automatic refreshing every 5 seconds
- 📊 **Port Statistics** - See total, active, and available ports at a glance
- 🎨 **Beautiful UI** - Modern, responsive design that works on all devices
- ⚡ **Fast & Lightweight** - Built with React 18, Vite, and Express.js
- 🎯 **Toast Notifications** - Modern toast notifications for all actions
- 💀 **Skull Animation** - Satisfying skull animation on successful kills
- 🔍 **Smart Tooltips** - Hover to see full process names that are truncated

## Quick Start

### Production Mode

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the React app:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm run server
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080`

## Development

For development with hot reload:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the API server** (in one terminal):
   ```bash
   npm run server:dev
   ```

3. **Start the Vite dev server** (in another terminal):
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` (or the port Vite assigns)

## Monitored Ports

The application monitors these commonly used development ports:
- **3000-3005** - React, Vue, Angular, Next.js development servers
- **5173-5175** - Vite development servers
- **8080** - Common application server port
- **9000-9005** - Various development tools and services

## How It Works

1. **Port Scanning**: The server uses `lsof` to check which ports are in use
2. **Process Identification**: For each active port, it identifies the PID and process name
3. **Process Management**: Uses `kill -9` to terminate processes when requested
4. **Real-time Updates**: The web interface refreshes to show current status

## API Endpoints

### GET /api/ports
Returns status of all monitored ports:
```json
[
  {
    "port": 3000,
    "inUse": true,
    "pid": 12345,
    "process": "node"
  },
  {
    "port": 3001,
    "inUse": false,
    "pid": null,
    "process": null
  }
]
```

### POST /api/kill/:pid
Kills a process by PID:
```json
{
  "success": true,
  "message": "Process 12345 killed successfully"
}
```

## Safety Features

- **Error Handling**: Graceful error handling with user-friendly toast notifications
- **Process Validation**: Only kills processes that are actually running
- **Visual Feedback**: Button state changes and animations confirm successful actions

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Port 8080 is already in use
If port 8080 is occupied, you can modify the PORT variable in `server.js`.

### Permission issues with killing processes
Some processes may require elevated permissions. Run the application with appropriate permissions if needed.

### Ports not showing up
Make sure you have `lsof` installed on your system (it comes pre-installed on macOS and most Linux distributions).

## Tech Stack

- **Frontend**: React 18 with Vite for blazing fast hot module replacement
- **Backend**: Express.js API server with ES modules
- **UI Library**: react-hot-toast for elegant notifications
- **Styling**: Modern CSS with gradients, animations, and dark theme
