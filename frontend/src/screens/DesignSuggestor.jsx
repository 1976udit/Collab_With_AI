import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function DesignSuggestor() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a design prompt");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/design/suggest",
        {
          prompt,
        }
      );
      setSuggestions(response.data.suggestions);
    } catch (err) {
      setError("Failed to get suggestions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        UI Design Suggestor
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Describe your design needs"
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Get Design Suggestions"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>

      {suggestions && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Suggested Design Concepts
          </Typography>

          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              sx={{ mb: 4, p: 3, border: "1px solid #ddd", borderRadius: 1 }}
            >
              <Typography variant="h6">{suggestion.name}</Typography>
              <Typography sx={{ mb: 2 }}>{suggestion.description}</Typography>

              <Typography variant="subtitle1">Color Palette:</Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {Object.entries(suggestion.colorPalette).map(
                  ([name, color]) => (
                    <Box
                      key={name}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: color,
                          mr: 1,
                          border: "1px solid #ccc",
                        }}
                      />
                      <Typography variant="body2">
                        {name}: {color}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>

              <Typography variant="subtitle1">Typography:</Typography>
              <Typography sx={{ mb: 2 }}>
                {Object.entries(suggestion.typography)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")}
              </Typography>

              <Typography variant="subtitle1">Layout:</Typography>
              <Typography sx={{ mb: 2 }}>{suggestion.layout}</Typography>

              <Typography variant="subtitle1">Components:</Typography>
              <Typography sx={{ mb: 2 }}>
                {suggestion.components.join(", ")}
              </Typography>

              <Typography variant="subtitle1">Interactive Elements:</Typography>
              <Typography>
                {suggestion.interactiveElements.join(", ")}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DesignSuggestor;
