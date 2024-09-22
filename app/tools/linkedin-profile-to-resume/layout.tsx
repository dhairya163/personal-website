import { Metadata } from 'next';
import { metadata as pageMetadata } from './metadata';

export const metadata: Metadata = pageMetadata;

export default function LinkedInProfileToResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
}
