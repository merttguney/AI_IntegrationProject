"use client";
import React, { useState } from "react";
import { Box, Container, Typography, Paper, Select, MenuItem, TextField, Button, InputLabel, FormControl, Grid, CircularProgress, Snackbar, Alert } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "gemini", label: "Gemini" },
];

export default function Home() {
  const [provider, setProvider] = useState("openai");
  const [credential, setCredential] = useState("");
  const [language, setLanguage] = useState("en");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
      // Burada gerçek login/register işlemi yapılabilir, şimdilik credential'ı header olarak gönderiyoruz
      const res = await axios.post(
        "http://localhost:3000/api/ai/translate-and-seo",
        {
          baseFields: { name, description },
          targetLanguages: [language],
          provider,
        },
        {
          headers: {
            Authorization: `Bearer ${credential}`,
          },
        }
      );
      setResult(res.data.results?.[language]);
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
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Credential (JWT veya API Key)"
                value={credential}
                onChange={e => setCredential(e.target.value)}
                fullWidth
                required
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dil (en, tr, fr)"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kategori/Ürün Adı"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama"
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
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