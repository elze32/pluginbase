/**
 * Type décrivant l'issue d'une tentative de sélection de dossier
 */
export type PickerOutcome =
  | { status: 'ok'; dirHandle: FileSystemDirectoryHandle }
  | { status: 'cancelled' }
  | { status: 'blocked_by_browser' }
  | { status: 'unknown_error'; error: unknown };

/**
 * Encapsule showDirectoryPicker avec une gestion fine des erreurs de sécurité/annulation
 */
export async function openDirectoryPicker(): Promise<PickerOutcome> {
  try {
    const dirHandle = await window.showDirectoryPicker({ 
      mode: 'read',
      startIn: 'desktop'
    });
    return { status: 'ok', dirHandle };
  } catch (err) {
    if (err instanceof DOMException) {
      // Chrome renvoie AbortError si l'utilisateur clique sur "Annuler"
      // MAIS AUSSI s'il clique sur "Annuler" après le message "Contient des fichiers système"
      if (err.name === 'AbortError') return { status: 'cancelled' };
      
      // SecurityError ou NotAllowedError pour les dossiers système bloqués (ex: C:\Windows)
      if (err.name === 'SecurityError' || err.name === 'NotAllowedError') {
        return { status: 'blocked_by_browser' };
      }
    }
    return { status: 'unknown_error', error: err };
  }
}
