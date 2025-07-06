"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  SmartToy as AIIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { postToBackend } from "../utils/api";

const SUPPORTED_LANGUAGES = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
];

export default function Home() {
  const [baseLanguage, setBaseLanguage] = useState("tr");
  const [targetLanguages, setTargetLanguages] = useState(["en", "fr"]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiResults, setAiResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAI = async () => {
    if (!name || !description) {
      setError("Kategori adı ve açıklaması zorunludur");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    setAiResults({});
    try {
      const response = await postToBackend("/api/ai/translate-and-seo", {
        baseFields: { name, description },
        targetLanguages,
      });
      setAiResults(response.results);
      setSuccess("AI ile içerik başarıyla oluşturuldu!");
    } catch (err: any) {
      setError(err?.response?.data?.error || "AI servisi ile iletişim kurulamadı");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        AI Destekli Kategori Çeviri & SEO
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Kategori adı ve açıklamasını gir, hedef dilleri seç, AI ile otomatik çeviri ve SEO alanlarını oluştur.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <AIIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Kategori Bilgileri
            </Typography>
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>Ana Dil</InputLabel>
              <Select
                value={baseLanguage}
                label="Ana Dil"
                onChange={e => setBaseLanguage(e.target.value)}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TextField
            fullWidth
            label="Kategori Adı"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Örn: Elektronik Ürünler"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Kategori Açıklaması"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Kategori hakkında detaylı açıklama..."
            sx={{ mb: 2 }}
          />
          <Box mb={2}>
            <Typography variant="subtitle2" mb={1}>Hedef Diller</Typography>
            {SUPPORTED_LANGUAGES.filter(l => l.code !== baseLanguage).map(lang => (
              <Chip
                key={lang.code}
                label={lang.name}
                onClick={() => {
                  setTargetLanguages(tls => tls.includes(lang.code)
                    ? tls.filter(lc => lc !== lang.code)
                    : [...tls, lang.code]);
                }}
                color={targetLanguages.includes(lang.code) ? "primary" : "default"}
                variant={targetLanguages.includes(lang.code) ? "filled" : "outlined"}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
            onClick={handleAI}
            disabled={loading || !name || !description}
            size="large"
          >
            {loading ? "AI İçerik Oluşturuluyor..." : "AI ile Çeviri ve SEO Oluştur"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>{error}</Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>{success}</Alert>
      )}

      {Object.keys(aiResults).length > 0 && (
        <Box>
          <Typography variant="h5" fontWeight={600} mb={3}>
            AI Oluşturulan İçerikler
          </Typography>
          {targetLanguages.map(lang => {
            const langData = aiResults[lang];
            if (!langData) return null;
            return (
              <Accordion key={lang} defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography variant="h6" fontWeight={600}>
                      {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name}
                    </Typography>
                    <Box ml="auto" display="flex" gap={1}>
                      <Chip label="AI Oluşturuldu" color="success" size="small" icon={<AIIcon />} />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      label="Kategori Adı (Çeviri)"
                      value={langData.title || ""}
                      multiline
                      rows={2}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => copyToClipboard(langData.title || '', `${lang}-title`)} size="small">
                            {copiedField === `${lang}-title` ? <CheckIcon /> : <CopyIcon />}
                          </IconButton>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Açıklama (Çeviri)"
                      value={langData.description || ""}
                      multiline
                      rows={3}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => copyToClipboard(langData.description || '', `${lang}-description`)} size="small">
                            {copiedField === `${lang}-description` ? <CheckIcon /> : <CopyIcon />}
                          </IconButton>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Meta Title (AI)"
                      value={langData.metaTitle || ""}
                      multiline
                      rows={2}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => copyToClipboard(langData.metaTitle || '', `${lang}-metaTitle`)} size="small">
                            {copiedField === `${lang}-metaTitle` ? <CheckIcon /> : <CopyIcon />}
                          </IconButton>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Meta Description (AI)"
                      value={langData.metaDescription || ""}
                      multiline
                      rows={3}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => copyToClipboard(langData.metaDescription || '', `${lang}-metaDescription`)} size="small">
                            {copiedField === `${lang}-metaDescription` ? <CheckIcon /> : <CopyIcon />}
                          </IconButton>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Anahtar Kelimeler (AI)"
                      value={Array.isArray(langData.keywords) ? langData.keywords.join(', ') : ''}
                      multiline
                      rows={2}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => copyToClipboard(Array.isArray(langData.keywords) ? langData.keywords.join(', ') : '', `${lang}-keywords`)} size="small">
                            {copiedField === `${lang}-keywords` ? <CheckIcon /> : <CopyIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
} 