import { Metadata } from 'next';
import { ScanInterface } from './ScanInterface';

export const metadata: Metadata = {
  title: 'Scanner mon inventaire — PluginBase',
  description: 'Scannez votre dossier VST3/AU local pour découvrir votre inventaire de plugins.',
};

export default function ScanPage() {
  return (
    <>
      <header className="mb-12 text-center md:text-left">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
          Mon inventaire
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-body max-w-2xl">
          Scannez vos dossiers locaux pour mettre à jour votre liste de plugins et vos classifications.
        </p>
      </header>

      <ScanInterface />
    </>
  );
}
