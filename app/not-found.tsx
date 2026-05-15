import { permanentRedirect } from 'next/navigation';

export default function NotFound() {
  // 🪐 GOD-MODE: Zero 404 Policy
  // Redirect every invalid URL back to the high-converting home page
  permanentRedirect('/');
  
  return null;
}
