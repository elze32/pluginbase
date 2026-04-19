import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="max-w-[480px] w-full text-center space-y-8">
        <h1 className="font-display text-[72px] md:text-[120px] font-bold text-[var(--accent)] leading-none">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Cette page ne fait pas partie de ta collection.
          </h2>
          <p className="font-body text-lg text-[var(--text-secondary)] leading-relaxed">
            Le lien que tu as suivi est peut-être brisé ou la page a été déplacée dans une autre catégorie.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/inventaire" 
            className="w-full sm:w-auto px-8 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[10px] font-display font-bold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Retour à l'inventaire
          </Link>
          <Link 
            href="/" 
            className="w-full sm:w-auto px-8 py-3 bg-white border border-[var(--border-strong)] text-[var(--text-primary)] rounded-[10px] font-display font-bold hover:bg-[var(--bg-base)] transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
