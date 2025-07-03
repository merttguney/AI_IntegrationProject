"use client";
import React, { useState } from "react";
import { Box, Container, Typography, Paper, Select, MenuItem, TextField, Button, InputLabel, FormControl, Grid, CircularProgress, Snackbar, Alert } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { postToBackend } from "../utils/api";

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "gemini", label: "Gemini" },
];

export default function Home() {
  const [provider, setProvider] = useState("openai");
  const [credential, setCredential] = useState("");
  const [language, setLanguage] = useState("en");
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = {
        baseFields: { name },
        targetLanguages: [language],
        provider,
      };
      const res = await postToBackend<{ results: any }>("/api/ai/translate-and-seo", data, credential);
      setResult(res.results?.[language]);
      setOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Bir hata oluştu");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <ChatIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            AI SEO & Chat Integration
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <div>
              <FormControl fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={provider}
                  label="Provider"
                  onChange={e => setProvider(e.target.value)}
                >
                  {PROVIDERS.map(p => (
                    <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                label="Credential (JWT veya API Key)"
                value={credential}
                onChange={e => setCredential(e.target.value)}
                fullWidth
                type="password"
              />
            </div>
            <div>
              <TextField
                label="Dil (en, tr, fr)"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                fullWidth
                required
              />
            </div>
            <div>
              <TextField
                label="Kategori/Ürün Adı"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                required
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "AI ile Doldur"}
              </Button>
            </div>
          </Grid>
        </form>
        {result && (
          <Box mt={4}>
            <Typography variant="h6" color="primary">Sonuçlar</Typography>
            <Typography variant="subtitle1" fontWeight={700}>Başlık:</Typography>
            <Typography>{result.title}</Typography>
            <Typography variant="subtitle1" fontWeight={700} mt={2}>Açıklama:</Typography>
            <Typography>{result.description}</Typography>
            <Typography variant="subtitle1" fontWeight={700} mt={2}>Anahtar Kelimeler:</Typography>
            <Typography>{Array.isArray(result.keywords) ? result.keywords.join(", ") : result.keywords}</Typography>
          </Box>
        )}
        <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
          {error ? (
            <Alert severity="error" onClose={() => setOpen(false)}>{error}</Alert>
          ) : (
            <Alert severity="success" onClose={() => setOpen(false)}>İşlem başarılı!</Alert>
          )}
        </Snackbar>
      </Paper>
    </Container>
  );
} 