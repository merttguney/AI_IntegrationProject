import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid2 as Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  IconButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  SmartToy as AIIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { postToBackend } from '../utils/api';

interface CategoryData {
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface LanguageData {
  [key: string]: CategoryData;
}

const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
];

export default function CategoryManager() {
  const [baseLanguage, setBaseLanguage] = useState('tr');
  const [targetLanguages, setTargetLanguages] = useState(['en', 'fr']);
  const [baseData, setBaseData] = useState<CategoryData>({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
  });
  
  const [aiResults, setAiResults] = useState<LanguageData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleBaseDataChange = (field: keyof CategoryData, value: string | string[]) => {
    setBaseData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    handleBaseDataChange('keywords', keywords);
  };

  const generateWithAI = async () => {
    if (!baseData.name || !baseData.description) {
      setError('Kategori adı ve açıklaması zorunludur');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await postToBackend('/api/ai/translate-and-seo', {
        baseFields: {
          name: baseData.name,
          description: baseData.description,
        },
        targetLanguages,
      });

      setAiResults(response.results);
      setSuccess('AI ile içerik başarıyla oluşturuldu!');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'AI servisi ile iletişim kurulamadı');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getFieldValue = (lang: string, field: keyof CategoryData) => {
    if (lang === baseLanguage) {
      return baseData[field];
    }
    return aiResults[lang]?.[field] || '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Kategori Yönetimi
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        AI destekli kategori oluşturma ve çoklu dil desteği
      </Typography>

      {/* Ana Dil Girişi */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <AIIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Ana Dil İçeriği ({SUPPORTED_LANGUAGES.find(l => l.code === baseLanguage)?.name})
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ana Dil</InputLabel>
                <Select
                  value={baseLanguage}
                  label="Ana Dil"
                  onChange={(e) => setBaseLanguage(e.target.value)}
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Kategori Adı"
                value={baseData.name}
                onChange={(e) => handleBaseDataChange('name', e.target.value)}
                placeholder="Örn: Elektronik Ürünler"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Kategori Açıklaması"
                value={baseData.description}
                onChange={(e) => handleBaseDataChange('description', e.target.value)}
                placeholder="Kategori hakkında detaylı açıklama..."
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
              onClick={generateWithAI}
              disabled={loading || !baseData.name || !baseData.description}
              size="large"
            >
              {loading ? 'AI İçerik Oluşturuluyor...' : 'AI ile Çeviri ve SEO Oluştur'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Hata ve Başarı Mesajları */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Hedef Diller Seçimi */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Hedef Diller
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {SUPPORTED_LANGUAGES.filter(lang => lang.code !== baseLanguage).map(lang => (
              <Chip
                key={lang.code}
                label={lang.name}
                onClick={() => {
                  const newTargets = targetLanguages.includes(lang.code)
                    ? targetLanguages.filter(l => l !== lang.code)
                    : [...targetLanguages, lang.code];
                  setTargetLanguages(newTargets);
                }}
                color={targetLanguages.includes(lang.code) ? 'primary' : 'default'}
                variant={targetLanguages.includes(lang.code) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* AI Sonuçları */}
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
                      <Chip 
                        label="AI Oluşturuldu" 
                        color="success" 
                        size="small" 
                        icon={<AIIcon />}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Kategori Adı"
                        value={langData.title || ''}
                        multiline
                        rows={2}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => copyToClipboard(langData.title || '', `${lang}-title`)}
                              size="small"
                            >
                              {copiedField === `${lang}-title` ? <CheckIcon /> : <CopyIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Meta Başlık"
                        value={langData.title || ''}
                        multiline
                        rows={2}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => copyToClipboard(langData.title || '', `${lang}-meta-title`)}
                              size="small"
                            >
                              {copiedField === `${lang}-meta-title` ? <CheckIcon /> : <CopyIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        label="Açıklama"
                        value={langData.description || ''}
                        multiline
                        rows={3}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => copyToClipboard(langData.description || '', `${lang}-description`)}
                              size="small"
                            >
                              {copiedField === `${lang}-description` ? <CheckIcon /> : <CopyIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        label="Anahtar Kelimeler"
                        value={Array.isArray(langData.keywords) ? langData.keywords.join(', ') : ''}
                        multiline
                        rows={2}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => copyToClipboard(Array.isArray(langData.keywords) ? langData.keywords.join(', ') : '', `${lang}-keywords`)}
                              size="small"
                            >
                              {copiedField === `${lang}-keywords` ? <CheckIcon /> : <CopyIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
} 