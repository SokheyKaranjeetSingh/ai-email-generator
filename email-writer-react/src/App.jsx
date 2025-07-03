import { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#81d4fa' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#ff9100' : '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 600,
        letterSpacing: -0.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleReset = () => {
    setEmailContent("");
    setTone("");
    setGeneratedReply("");
    setError("");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError("Please enter the email content to generate a reply");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://email-writer-sb-latest.onrender.com/api/email/generate", {
        emailContent,
        tone,
      });

      setGeneratedReply(
        typeof response.data === "string" ? response.data : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Failed to generate email reply. Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: 4, pb: 6, transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="md">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, transition: 'all 0.3s ease' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h3" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                Email Reply Generator
              </Typography>
              <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton onClick={toggleTheme} color="primary" sx={{ backgroundColor: 'action.hover', '&:hover': { backgroundColor: 'action.selected' } }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
              Enter your original email content below and get an AI-generated professional reply.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              placeholder="Paste the email you received here..."
              value={emailContent || ""}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
              error={!!error && !emailContent.trim()}
              helperText={(!emailContent.trim() && error) ? "Email content is required" : ""}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Response Tone</InputLabel>
              <Select value={tone || ""} label="Response Tone" onChange={(e) => setTone(e.target.value)}>
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="enthusiastic">Enthusiastic</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  py: 1.5,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #4f71be 30%, #1976d2 90%)'
                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  color: 'white',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #5f81ce 30%, #2986e2 90%)'
                      : 'linear-gradient(45deg, #30a5F3 30%, #30dBF3 90%)',
                  }
                }}
              >
                {loading ? "Generating..." : "Generate Reply"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                disabled={loading || (!emailContent && !tone && !generatedReply)}
                startIcon={<RestartAltIcon />}
                sx={{ py: 1.5 }}
              >
                Reset
              </Button>
            </Box>

            {error && !error.includes("Please enter") && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {generatedReply && (
              <Fade in={!!generatedReply}>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Generated Reply
                    </Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton onClick={handleCopyToClipboard} color="primary" size="small" sx={{ border: '1px solid', borderColor: 'primary.light', '&:hover': { backgroundColor: 'action.hover' } }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap', fontFamily: '"Roboto Mono", monospace', lineHeight: 1.7 }}>
                      {generatedReply}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            )}
          </Paper>
        </Container>

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
