import React from 'react';
import { Star } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventory-store';

interface FavoriteButtonProps {
  id: string;
  isFavorite: boolean;
}

export function FavoriteButton({ id, isFavorite }: FavoriteButtonProps) {
  const toggleFavorite = useInventoryStore((state) => state.toggleFavorite);

  return (
    <button
      onClick={() => toggleFavorite(id)}
      className={`
        p-1.5 rounded-full transition-all duration-150 ease-out
        hover:bg-[var(--bg-base)] active:scale-90
      `}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Star
        size={18}
        className={`transition-colors duration-150 ${isFavorite ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
      />
    </button>
  );
}
