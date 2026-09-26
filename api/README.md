# PhD Navigator API contract

GitHub Pages is the public static frontend. Real CV parsing and personalized matching must run on a private backend so API keys are never exposed.

## POST /api/profile/parse
multipart/form-data: cv file
Returns structured education, research experience, publications, methods, skills, interests.

## POST /api/match
JSON: { profile, program }
Returns component scores (research, methods, faculty, preparation, experience), evidence and gaps. Scores are decision-support, not admission probabilities.

## GET /api/programs/search?q=&country=&field=
Returns programs with official source provenance.

## GET /api/faculty/:id/works
Returns identity-resolved recent works from OpenAlex/Crossref.

Every factual admissions field must carry source_url, retrieved_at, verification_status and evidence.
