import {
  AnalysisResponse,
  UrlAnalysisResponse,
  ImageAnalysisResponse,
  OfficialResource,
  IncidentRecord,
  EvaluationSummary,
  UserSituation,
  Language
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function analyzeScenario(
  text: string,
  situation: UserSituation = 'BEFORE_PAYMENT',
  language: Language = 'en',
  source_url?: string
): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, situation, language, source_url })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Analysis request failed');
  }
  return res.json();
}

export async function analyzeUrl(url: string, language: Language = 'en'): Promise<UrlAnalysisResponse> {
  const res = await fetch(`${API_BASE}/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, language })
  });
  if (!res.ok) throw new Error('URL analysis failed');
  return res.json();
}

export async function analyzeImage(
  file: File,
  situation: UserSituation = 'BEFORE_PAYMENT',
  language: Language = 'en'
): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('situation', situation);
  formData.append('language', language);

  const res = await fetch(`${API_BASE}/analyze/image`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Image OCR analysis failed');
  }
  return res.json();
}

export async function getOfficialResources(category?: string): Promise<OfficialResource[]> {
  const url = category ? `${API_BASE}/resources?category=${encodeURIComponent(category)}` : `${API_BASE}/resources`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function getIncidents(): Promise<IncidentRecord[]> {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function createIncident(incident: Partial<IncidentRecord>): Promise<IncidentRecord> {
  const res = await fetch(`${API_BASE}/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incident)
  });
  if (!res.ok) throw new Error('Failed to save incident record');
  return res.json();
}

export async function deleteIncident(incidentId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/incidents/${incidentId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete incident');
}

export async function clearAllIncidents(): Promise<void> {
  const res = await fetch(`${API_BASE}/incidents`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear incidents');
}

export async function getEvaluationSummary(): Promise<EvaluationSummary> {
  const res = await fetch(`${API_BASE}/evaluation/summary`);
  if (!res.ok) throw new Error('Failed to fetch evaluation metrics');
  return res.json();
}
