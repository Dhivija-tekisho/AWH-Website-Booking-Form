# React + TypeScript + Vite

## Backend Integration (Dynamic Mode)

This frontend now runs in two modes:

- AI chat calls go through `/api/ai/*` and are proxied to AI orchestration.
- Booking/patient/doctor/slot calls go through `/api/dhp/*` and are proxied to DHP core-api with a service JWT minted in the Vite server.

### 1) Set frontend environment variables

Create or update `.env` in this project root:

```env
# AI orchestration host (must expose /v1/ai/chat)
VITE_AI_ORCHESTRATION_URL=http://localhost:3000

# Optional overrides for frontend fetch base paths
VITE_AI_API_BASE_URL=/api/ai
VITE_DHP_API_BASE_URL=/api/dhp

# Tenant used by chat and service-token signing
VITE_DHP_ORGANIZATION_ID=30000000-0000-0000-0000-000000000001

# DHP core-api URL and shared signing secret for service JWT
DHP_CORE_API_URL=http://localhost:3000
DHP_SERVICE_TOKEN_SECRET=change-me-to-your-real-service-token-secret

# Optional override when minting service token
DHP_ORGANIZATION_ID=30000000-0000-0000-0000-000000000001
```

Important:

- `DHP_SERVICE_TOKEN_SECRET` must match the secret expected by your DHP core-api auth configuration.
- These non-`VITE_` variables are read by Vite server code only (not exposed to browser JS).

### 2) Run backends

- Start DHP core-api (your backend project in `C:\AWH\DHP`).
- Start AI orchestration API (your backend project in `C:\AWH\ai-orchestration`).

### 3) Run frontend

```bash
npm run dev
```

The app will run on `http://localhost:5174` and communicate with both backends through the proxy.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
