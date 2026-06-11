/**
 * Type declarations for asset imports (fonts, images, etc.)
 * Metro bundler returns a number (module reference) for static assets.
 */
declare module '*.ttf' {
  const value: number;
  export default value;
}
