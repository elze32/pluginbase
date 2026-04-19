-- Migration: add_pending_deletion
-- Ajoute le soft-delete asynchrone sur PluginInstallation
-- Le champ pendingDeletion = true signifie "fichier à supprimer localement par l'app Tauri"
-- Après confirmation de suppression physique, la ligne est supprimée de la BDD.

ALTER TABLE "PluginInstallation"
  ADD COLUMN "pendingDeletion"      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "pendingDeletionError" TEXT;
