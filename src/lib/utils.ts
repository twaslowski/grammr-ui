import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (s: string | undefined) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const getBackendHost = () => {
  const host = process.env.BACKEND_HOST;
  if (!host) {
    throw new Error('BACKEND_HOST environment variable is not set');
  }
  // Remove trailing slash if present
  return host.endsWith('/') ? host.slice(0, -1) : host;
};

export const buildApiUrl = (endpoint: string): string => {
  const backendHost = getBackendHost();
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${backendHost}/api/v1/${cleanEndpoint}`;
};
