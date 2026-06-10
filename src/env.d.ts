/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly FIREBASE_PRIVATE_KEY_ID: string;
  readonly FIREBASE_PRIVATE_KEY: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_CLIENT_ID: string;
  readonly FIREBASE_AUTH_URI: string;
  readonly FIREBASE_TOKEN_URI: string;
  readonly FIREBASE_AUTH_CERT_URL: string;
  readonly FIREBASE_CLIENT_CERT_URL: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_API_TOKEN?: string;
  // Birthday invite — host RSVP email (optional; defaults baked into notify.ts)
  readonly RSVP_FROM?: string;
  readonly RSVP_NOTIFY_TO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
