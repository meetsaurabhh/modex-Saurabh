/**
 * src/app.js - Medication Interaction Checker server (meds only)
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

/**
 * GET /meds
 * List medications
 */
app.get('/meds', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, common_use, notes FROM medications ORDER BY name');
    res.json({ success: true, meds: rows });
  } catch (err) {
    console.error('GET /meds error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /meds/:id
 */
app.get('/meds/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ success: false, error: 'Invalid id' });
  try {
    const { rows } = await db.query('SELECT id, name, common_use, notes FROM medications WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Medication not found' });
    res.json({ success: true, med: rows[0] });
  } catch (err) {
    console.error('GET /meds/:id error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /check-interactions
 * Body: { meds: ["Aspirin","Warfarin", ...] }
 *
 * Response: {
 *   success: true,
 *   interactions: [...],
 *   overall_severity: { level, text } | null,
 *   missing: [...]
 * }
 */
app.post('/check-interactions', async (req, res) => {
  const medsInput = req.body.meds;
  if (!Array.isArray(medsInput) || medsInput.length < 2) {
    return res.status(400).json({ success: false, error: 'Provide an array "meds" with at least two medication names' });
  }

  const medsNormalized = medsInput.map((m) => (typeof m === 'string' ? m.trim() : '')).filter(Boolean);

  try {
    const placeholders = medsNormalized.map((_, i) => `$${i + 1}`).join(',');
    const medsQuery = `SELECT id, name FROM medications WHERE name IN (${placeholders})`;
    const medsRes = await db.query(medsQuery, medsNormalized);
    const found = medsRes.rows;
    const foundNames = found.map((r) => r.name);
    const missing = medsNormalized.filter((n) => !foundNames.includes(n));

    if (found.length < 2) {
      return res.status(400).json({ success: false, error: 'At least two known medications required', missing });
    }

    const ids = found.map((r) => r.id);

    const pairQuery = `
      SELECT mi.*, ma.name AS med_a_name, mb.name AS med_b_name
      FROM med_interactions mi
      JOIN medications ma ON ma.id = mi.med_a
      JOIN medications mb ON mb.id = mi.med_b
      WHERE mi.med_a = ANY($1::int[]) AND mi.med_b = ANY($1::int[])
    `;
    const pairRes = await db.query(pairQuery, [ids]);

    const interactions = [];
    let overallLevel = 0;
    for (const row of pairRes.rows) {
      if (ids.includes(row.med_a) && ids.includes(row.med_b) && row.med_a !== row.med_b) {
        interactions.push({
          med_a: row.med_a_name,
          med_b: row.med_b_name,
          severity_level: row.severity_level,
          severity_text: row.severity_text,
          explanation: row.explanation,
          alternatives: row.alternatives
        });
        if (row.severity_level > overallLevel) overallLevel = row.severity_level;
      }
    }

    const levelMap = { 1: 'Low', 2: 'Moderate', 3: 'Severe' };
    const overallSeverity = overallLevel > 0 ? { level: overallLevel, text: levelMap[overallLevel] } : null;

    res.json({ success: true, requested: medsNormalized, missing, interactions, overall_severity: overallSeverity });
  } catch (err) {
    console.error('POST /check-interactions error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
