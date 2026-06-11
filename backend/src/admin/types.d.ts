import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userNombre?: string;
    userRol?: 'ADMIN';
    success?: string;
    error?: string;
  }
}
