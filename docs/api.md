# API Design Principles

This document summarizes the API design principles used in the Modex Medication Interaction Checker. It is intentionally concise and focused for reviewers.

## 1) Minimal yet expressive endpoints
- GET /meds → list medications
- GET /meds/:id → medication details
- POST /check-interactions → core interaction engine

The API avoids unnecessary CRUD endpoints. Focus is on interaction logic.

## 2) Human-friendly payloads
Instead of sending medication IDs (inconvenient for UI),
the client sends names:

{
  "meds": ["Warfarin", "Aspirin"]
}

Backend steps:
1. normalize names
2. map to medication IDs
3. evaluate pairwise interactions

## 3) Predictable response format

Every response follows a strict structure:

success → boolean
requested → array of requested names
missing → array of unknown names
interactions → list of interaction objects:
   med_a
   med_b
   severity_level (1 low, 2 moderate, 3 severe)
   severity_text
   explanation
   alternatives
overall_severity → { level, text } or null

## 4) Error handling

400 → bad input (not an array, fewer than 2 meds)
400 → not enough known meds; includes “missing” list
500 → server error with safe generic message

## 5) UX Considerations

- Display missing meds so user can correct typos.
- Prominently show overall severity (color-coded).
- Show individual pair explanations in expandable sections.

## 6) Extensibility

- Add synonym matching (Paracetamol ↔ Acetaminophen)
- Add multi-drug interactions (3+ medications)
- Add clinical user-specific modifiers (age, kidney issues)
- Version the API (e.g., /v1/check-interactions)

