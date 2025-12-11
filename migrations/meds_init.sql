-- migrations/meds_init.sql
-- Medications and pairwise interactions (simple dataset for the assignment)

DROP TABLE IF EXISTS med_interactions;
DROP TABLE IF EXISTS medications;

CREATE TABLE medications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  common_use TEXT,
  notes TEXT
);

CREATE TABLE med_interactions (
  id SERIAL PRIMARY KEY,
  med_a INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  med_b INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  severity_level INTEGER NOT NULL, -- 1 = low, 2 = moderate, 3 = severe
  severity_text TEXT NOT NULL,
  explanation TEXT,
  alternatives TEXT -- JSON string or comma separated list of safer alternatives
);

-- Insert sample medications
INSERT INTO medications (name, common_use, notes) VALUES
('Paracetamol', 'Analgesic / Antipyretic', 'Generally safe, watch total daily dose'),
('Ibuprofen', 'NSAID - pain/fever/inflammation', 'May increase bleeding risk with some drugs'),
('Aspirin', 'Antiplatelet / analgesic', 'Low-dose used for cardiovascular prevention'),
('Warfarin', 'Anticoagulant', 'Requires INR monitoring; many interactions'),
('Metformin', 'Type 2 diabetes', 'Watch kidney function'),
('Lisinopril', 'ACE inhibitor for hypertension', 'Can increase potassium with some drugs');

-- Insert pairwise interactions (only one direction needed; we will query unordered)
-- Warfarin + Aspirin -> Severe (increased bleeding risk)
INSERT INTO med_interactions (med_a, med_b, severity_level, severity_text, explanation, alternatives)
VALUES (
  (SELECT id FROM medications WHERE name='Warfarin'),
  (SELECT id FROM medications WHERE name='Aspirin'),
  3,
  'Severe',
  'Concurrent use greatly increases risk of bleeding; clinical monitoring required and generally avoid combination unless supervised.',
  'Consider discussing with clinician; alternatives: Clopidogrel (only if indicated) - depends on indication'
);

-- Warfarin + Ibuprofen -> Severe (NSAIDs increase bleeding + potentiate anticoagulation)
INSERT INTO med_interactions (med_a, med_b, severity_level, severity_text, explanation, alternatives)
VALUES (
  (SELECT id FROM medications WHERE name='Warfarin'),
  (SELECT id FROM medications WHERE name='Ibuprofen'),
  3,
  'Severe',
  'NSAIDs increase gastrointestinal bleeding risk and may potentiate Warfarin effect; avoid NSAIDs with warfarin when possible.',
  'Use acetaminophen (Paracetamol) for pain control after consulting clinician'
);

-- Aspirin + Ibuprofen -> Moderate (increased bleeding, may interfere with antiplatelet effect)
INSERT INTO med_interactions (med_a, med_b, severity_level, severity_text, explanation, alternatives)
VALUES (
  (SELECT id FROM medications WHERE name='Aspirin'),
  (SELECT id FROM medications WHERE name='Ibuprofen'),
  2,
  'Moderate',
  'Concurrent use increases bleeding risk and ibuprofen can reduce the cardioprotective effect of low-dose aspirin.',
  'Avoid regular NSAID use; use paracetamol for analgesia if appropriate'
);

-- Metformin + Lisinopril -> Low (usually safe; example low severity)
INSERT INTO med_interactions (med_a, med_b, severity_level, severity_text, explanation, alternatives)
VALUES (
  (SELECT id FROM medications WHERE name='Metformin'),
  (SELECT id FROM medications WHERE name='Lisinopril'),
  1,
  'Low',
  'No major interactions; monitor kidney function as recommended.',
  'No direct alternative needed; monitor renal function'
);

-- Paracetamol + Warfarin -> Moderate (some evidence paracetamol may increase INR at high/regular doses)
INSERT INTO med_interactions (med_a, med_b, severity_level, severity_text, explanation, alternatives)
VALUES (
  (SELECT id FROM medications WHERE name='Paracetamol'),
  (SELECT id FROM medications WHERE name='Warfarin'),
  2,
  'Moderate',
  'Frequent high-dose paracetamol may increase INR in people on warfarin; use lowest effective dose and monitor.',
  'Use lowest effective dose; consult clinician for monitoring'
);

