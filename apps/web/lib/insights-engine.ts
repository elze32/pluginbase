import { InventoryItem } from '../stores/inventory-store';
import { CATEGORY_KNOWLEDGE } from './category-knowledge';
import { detectMultiFormatDuplicates, detectFunctionalDuplicates } from './duplicate-detector';
import { useSessionLogStore } from '../stores/session-log-store';

export interface Insight {
  severity: 'critical' | 'notable' | 'positive';
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}

function severityRank(s: Insight['severity']) {
  if (s === 'critical') return 3;
  if (s === 'notable') return 2;
  return 1;
}

export function generateInsights(items: InventoryItem[]): Insight[] {
  const insights: Insight[] = [];
  if (!items || items.length === 0) return insights;

  const total = items.length;

  // Counts by category and brand
  const categoryCounts: Record<string, number> = {};
  const brandCounts: Record<string, number> = {};

  items.forEach((it) => {
    const cat = (it.category || 'GENERIC').toUpperCase();
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    const b = (it.brand || 'Inconnu');
    brandCounts[b] = (brandCounts[b] || 0) + 1;
  });

  // 1. Surcollections par catégorie
  Object.keys(categoryCounts).forEach((cat) => {
    const count = categoryCounts[cat];
    const meta = CATEGORY_KNOWLEDGE[cat] || CATEGORY_KNOWLEDGE['GENERIC'];
    if (count > meta.warningThreshold) {
      insights.push({
        severity: 'critical',
        title: `${count} ${meta.labelSingular}s. Tu es sûr ?`,
        body: `La moyenne pro est ${meta.typicalCount.pro}. Tu en as ${count - meta.typicalCount.pro} de plus.`,
        actionLabel: 'Explorer',
        actionHref: `/categorie/${cat.toLowerCase()}`
      });
    }
  });

  // 2. Marque dominante > 20%
  const brandEntries = Object.entries(brandCounts).sort((a,b) => b[1]-a[1]);
  if (brandEntries.length > 0) {
    const [brand, bcount] = brandEntries[0];
    const percentage = Math.round((bcount / total) * 100);
    if (percentage > 20) {
      insights.push({
        severity: 'notable',
        title: `${brand} domine ta collection`,
        body: `${brand} possède ${bcount} de tes plugins — ${percentage}% de la collection.`,
        actionLabel: 'Voir',
        actionHref: '/inventaire'
      });
    }
  }

  // 3. Doublons multi-format non résolus
  const multi = detectMultiFormatDuplicates(items);
  const multiGroups = multi.length;
  if (multiGroups > 5) {
    insights.push({
      severity: 'critical',
      title: `${multiGroups} groupes multi-formats détectés`,
      body: `Tu as ${multiGroups} plugins installés en plusieurs formats. Tu peux désinstaller au moins la moitié.`,
      actionLabel: 'Voir les doublons',
      actionHref: '/doublons'
    });
  }

  // 4. Taux de classification faible (utilise les items.status)
  const classifiedCount = items.filter(i => i.status !== 'UNCLASSIFIED').length;
  const classifiedPercent = Math.round((classifiedCount / total) * 100);
  // Estimation basique : si faible (<10%)
  if (classifiedPercent < 10) {
    insights.push({
      severity: 'notable',
      title: `Faible taux de classification: ${classifiedPercent}%`,
      body: `Tu as classé seulement ${classifiedPercent}% de ta collection. Commence par marquer tes 10 essentiels.`,
      actionLabel: "Commencer",
      actionHref: '/inventaire'
    });
  }

  // 5. Collection très large
  if (total > 300) {
    insights.push({
      severity: 'notable',
      title: `${total} plugins — une collection massive`,
      body: `${total} plugins, c'est bien au-delà d'un home studio moyen. Moins, c'est souvent plus.`,
      actionLabel: 'Explorer',
      actionHref: '/insights'
    });
  }

  // 6. Si rien d'autre: collection équilibrée
  const hasCritical = insights.some(i => i.severity === 'critical');
  if (!hasCritical) {
    // Count categories at or above homeStudio
    const categoriesAtHome = Object.keys(categoryCounts).filter(cat => {
      const meta = CATEGORY_KNOWLEDGE[cat] || CATEGORY_KNOWLEDGE['GENERIC'];
      return categoryCounts[cat] >= meta.typicalCount.homeStudio;
    });
    if (categoriesAtHome.length >= 3) {
      insights.push({
        severity: 'positive',
        title: 'Collection bien équilibrée',
        body: `Au moins ${categoriesAtHome.length} catégories atteignent un niveau home-studio. C'est un bon équilibre.`
      });
    }
  }

  // Sort by severity rank desc, then keep top 5
  const sorted = insights.sort((a,b) => severityRank(b.severity) - severityRank(a.severity));
  return sorted.slice(0,5);
}
