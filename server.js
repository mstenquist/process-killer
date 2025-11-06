import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Development ports to monitor
const PORTS_TO_MONITOR = [3000, 3001, 3002, 3003, 3004, 3005, 5173, 5174, 5175, 8080, 9000, 9001, 9002, 9003, 9004, 9005];

// Function to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error) {
        resolve({ port, inUse: false, pid: null, process: null });
      } else {
        const pids = stdout.trim().split('\n');
        const pid = pids[0]; // Take first PID if multiple
        if (pid) {
          // Get process name without header
          exec(`ps -p ${pid} -o comm= 2>/dev/null`, (err, processName) => {
            resolve({
              port,
              inUse: true,
              pid: parseInt(pid),
              process: processName ? processName.trim() : 'Unknown'
            });
          });
        } else {
          resolve({ port, inUse: false, pid: null, process: null });
        }
      }
    });
  });
}

// API endpoint to get port status
app.get('/api/ports', async (req, res) => {
  try {
    const portPromises = PORTS_TO_MONITOR.map(port => checkPort(port));
    const portStatuses = await Promise.all(portPromises);
    res.json(portStatuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check ports' });
  }
});

// API endpoint to kill a process
app.post('/api/kill/:pid', (req, res) => {
  const pid = req.params.pid;

  exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: `Failed to kill process: ${error.message}` });
    } else {
      res.json({ success: true, message: `Process ${pid} killed successfully` });
    }
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Process Killer server running on http://localhost:${PORT}`);
  console.log(`Monitoring ports: ${PORTS_TO_MONITOR.join(', ')}`);
});