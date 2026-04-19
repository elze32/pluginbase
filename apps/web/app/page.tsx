import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Layers, 
  Clock, 
  Copy, 
  ShieldCheck
} from 'lucide-react';
import { InventoryRow } from '../components/inventory/InventoryRow';
import { InventoryItem } from '../stores/inventory-store';

// Mock data pour le visuel dashboard
const MOCK_ITEMS: InventoryItem[] = [
  {
    id: 'serum',
    nameRaw: 'Serum_x64.vst3',
    format: 'VST3',
    brand: 'Xfer Records',
    displayName: 'Serum',
    category: 'Synth',
    status: 'ESSENTIAL',
    favorite: true,
    customTags: []
  },
  {
    id: 'vintageverb',
    nameRaw: 'ValhallaVintageVerb.component',
    format: 'AU',
    brand: 'Valhalla DSP',
    displayName: 'VintageVerb',
    category: 'Reverb',
    status: 'ESSENTIAL',
    favorite: true,
    customTags: []
  },
  {
    id: 'massive',
    nameRaw: 'Massive.vst3',
    format: 'VST3',
    brand: 'Native Instruments',
    displayName: 'Massive',
    category: 'Synth',
    status: 'UNUSED',
    favorite: false,
    customTags: []
  },
  {
    id: 'kontakt',
    nameRaw: 'Kontakt 7.vst3',
    format: 'VST3',
    brand: 'Native Instruments',
    displayName: 'Kontakt 7',
    category: 'Sampler',
    status: 'TO_LEARN',
    favorite: false,
    customTags: []
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 max-w-[1400px] mx-auto py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Assistant de lucidité pour ton studio
            </span>
            
            <h1 className="font-display text-[48px] md:text-[72px] font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight">
              Tu as <span className="text-[var(--accent)]">247 plugins</span>.<br />
              Tu en utilises <span className="text-[var(--accent)]">12</span>.
            </h1>

            <p className="font-body text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-[540px] leading-relaxed">
              PluginBase scanne ta collection, détecte les doublons, et t'aide à arrêter d'acheter ce que tu as déjà. En français, sans te demander un euro.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <Link 
                href="/scan" 
                className="group flex items-center gap-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-4 rounded-[10px] font-mono text-[13px] uppercase tracking-[0.04em] transition-all"
              >
                Scanner ma collection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                Gratuit · Navigateur uniquement<br />Rien ne quitte ta machine
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="absolute inset-0 bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full" />
            <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[14px] shadow-lg overflow-hidden transform rotate-1">
              <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] opacity-50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] opacity-20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-white border border-[var(--border)] rounded-[8px] p-3 flex flex-col justify-center">
                    <span className="text-[20px] font-display font-bold text-[var(--accent)]">247</span>
                    <span className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Total</span>
                  </div>
                  <div className="h-16 bg-white border border-[var(--border)] rounded-[8px] p-3 flex flex-col justify-center">
                    <span className="text-[20px] font-display font-bold text-[var(--status-doublon)]">23</span>
                    <span className="text-[9px] font-mono uppercase text-[var(--text-muted)]">Doublons</span>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-px">
                {MOCK_ITEMS.map((item, i) => (
                  <div key={item.id} className="pointer-events-none opacity-80 scale-[0.98]">
                    <InventoryRow item={item} isLast={i === MOCK_ITEMS.length - 1} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="bg-[var(--bg-elevated)] py-32 px-6">
        <div className="max-w-[1100px] mx-auto space-y-20">
          <div className="text-center md:text-left space-y-6">
            <h2 className="font-display text-[36px] md:text-[42px] font-bold text-[var(--text-primary)]">
              Tu connais ce moment.
            </h2>
            <p className="font-body text-[18px] text-[var(--text-secondary)] max-w-[600px] leading-relaxed">
              Tu ouvres ton DAW. Tu veux un compresseur. Tu en as 11. Tu prends celui du haut de la liste, par défaut. Celui que tu as acheté l'an dernier pour 89€ ? Il dort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Layers size={32} />, title: 'Dispersion', text: 'VST3, AU, CLAP — le même plugin installé 3 fois. Et tu ne sais jamais lequel ton DAW charge vraiment.' },
              { icon: <Clock size={32} />, title: 'Oubli', text: "Tu as payé pour des bundles dont tu n'as jamais ouvert la moitié. Le souvenir s'efface vite." },
              { icon: <Copy size={32} />, title: 'Doublons', text: 'Sept reverbs. Tu en utilises une. Les six autres t\'' + 'ont coûté combien ?' }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="text-[var(--accent)]">{item.icon}</div>
                <h3 className="font-display text-[20px] font-bold">{item.title}</h3>
                <p className="font-body text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-[var(--bg-base)] py-32 px-6">
        <div className="max-w-[1100px] mx-auto space-y-20">
          <h2 className="font-display text-[36px] font-bold text-center md:text-left">
            Trois minutes. Pas plus.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { num: '01', title: 'Tu scannes', text: 'Clic. Choix du dossier VST3. Tout se passe dans ton navigateur — aucun fichier, aucun binaire, rien n\'' + 'est uploadé.' },
              { num: '02', title: 'On révèle', text: 'En quelques secondes : ton inventaire complet, classé par catégorie, avec les doublons évidents déjà identifiés.' },
              { num: '03', title: 'Tu décides', text: 'Essentiel, à vendre, à oublier. Tu classes. PluginBase se souvient pour toi.' }
            ].map((step, i) => (
              <div key={i} className="relative space-y-4 pt-12">
                <span className="absolute top-0 left-0 font-display text-[72px] font-bold text-[var(--accent)] opacity-20 leading-none">
                  {step.num}
                </span>
                <h3 className="font-display text-[22px] font-bold relative z-10">{step.title}</h3>
                <p className="font-body text-[15px] text-[var(--text-secondary)] leading-relaxed relative z-10">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidentialité */}
      <section className="py-24 px-6 border-y border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="max-w-[720px] mx-auto text-center space-y-6">
          <ShieldCheck size={32} className="mx-auto text-[var(--accent)]" />
          <h2 className="font-display text-[24px] font-bold">Ton studio reste ton studio</h2>
          <p className="font-body text-[16px] text-[var(--text-secondary)] leading-relaxed">
            PluginBase n'installe rien. Ne télécharge rien. Ne stocke rien sur un serveur tant que tu ne crées pas un compte. Le scan se passe dans ton navigateur, en lecture seule. On lit le nom des dossiers de plugins. C'est tout.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[var(--bg-elevated)] py-32 px-6 text-center space-y-12">
        <h2 className="font-display text-[36px] md:text-[48px] font-bold text-[var(--text-primary)] max-w-[800px] mx-auto leading-tight">
          Combien de plugins dormants dans ton studio ?
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Link 
            href="/scan" 
            className="group flex items-center gap-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-10 py-5 rounded-[12px] font-mono text-[14px] uppercase tracking-[0.04em] transition-all shadow-md"
          >
            Scanner ma collection
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            Aucune inscription requise pour essayer
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-[120px] border-t border-[var(--border)] px-12 flex items-center justify-between bg-[var(--bg-base)]">
        <div className="space-y-1">
          <span className="font-display font-bold text-[14px]">PluginBase</span>
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            © 2026 · Fait en France
          </p>
        </div>
        
        <nav className="flex items-center gap-8">
          <Link href="/confidentialite" className="font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Confidentialité
          </Link>
          <a href="mailto:pluginbase@example.com" className="font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Contact
          </a>
          <a 
            href="https://github.com/elze32/pluginbase" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            GitHub
          </a>
        </nav>
      </footer>
    </div>
  );
}
