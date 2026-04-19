'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { api } from '@/lib/api'
import type { PluginInstallation } from '@pluginbase/types'

const schema = z.object({
  pluginNameRaw: z.string().min(1, 'Le nom est requis'),
  brandRaw: z.string().optional(),
  format: z.enum(['VST3', 'AU', 'CLAP', 'AAX'], { required_error: 'Choisis un format' }),
  version: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['UNCLASSIFIED', 'ESSENTIAL', 'DOUBLON', 'UNUSED', 'TO_LEARN', 'TO_SELL', 'TO_TEST']),
})

type FormData = z.infer<typeof schema>

const FORMAT_OPTIONS = [
  { value: 'VST3', label: 'VST3' },
  { value: 'AU', label: 'AU' },
  { value: 'CLAP', label: 'CLAP' },
  { value: 'AAX', label: 'AAX' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'Non défini' },
  { value: 'compressor', label: 'Compresseur' },
  { value: 'reverb', label: 'Réverb' },
  { value: 'eq', label: 'Égaliseur' },
  { value: 'synth', label: 'Synthétiseur' },
  { value: 'delay', label: 'Delay' },
  { value: 'distortion', label: 'Distorsion / Saturation' },
  { value: 'limiter', label: 'Limiteur' },
  { value: 'chorus', label: 'Chorus / Modulation' },
  { value: 'sampler', label: 'Sampler' },
  { value: 'utility', label: 'Utilitaire' },
  { value: 'analyzer', label: 'Analyseur' },
  { value: 'other', label: 'Autre' },
]

const STATUS_OPTIONS = [
  { value: 'UNCLASSIFIED', label: 'Non classifié' },
  { value: 'ESSENTIAL', label: 'Essentiel' },
  { value: 'TO_LEARN', label: 'À apprendre' },
  { value: 'TO_TEST', label: 'À tester' },
  { value: 'UNUSED', label: 'Inutilisé' },
  { value: 'DOUBLON', label: 'Doublon' },
  { value: 'TO_SELL', label: 'À vendre' },
]

interface AddPluginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdded: (plugin: PluginInstallation) => void
}

export function AddPluginModal({ open, onOpenChange, onAdded }: AddPluginModalProps) {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { 
      format: 'VST3',
      status: 'UNCLASSIFIED'
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError(null)
    try {
      const res = await api.post<{ data: PluginInstallation }>('/api/v1/plugins', {
        ...data,
        category: data.category || undefined,
        brandRaw: data.brandRaw || undefined,
        version: data.version || undefined,
      })
      onAdded(res.data)
      reset()
      onOpenChange(false)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-text-primary/40 backdrop-blur-[2px] z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-surface border border-border rounded-2xl p-8 w-full max-w-[520px] shadow-2xl z-51 animate-in zoom-in-95 fade-in duration-200 focus:outline-none">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Dialog.Title className="font-display text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
                <Plus size={20} className="text-accent" /> Ajouter un plugin
              </Dialog.Title>
              <p className="text-xs text-text-secondary mt-1">Saisie manuelle pour ton inventaire</p>
            </div>
            <Dialog.Close asChild>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-bg-elevated text-text-muted hover:text-text-primary hover:bg-bg-sunken transition-all cursor-pointer">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Nom du plugin *"
                placeholder="ex: Serum, Pro-Q 3, Valhalla Room..."
                error={errors.pluginNameRaw?.message}
                className="bg-bg-sunken border-border focus:border-accent h-11"
                {...register('pluginNameRaw')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Marque"
                  placeholder="ex: Xfer, FabFilter..."
                  className="bg-bg-sunken border-border focus:border-accent"
                  {...register('brandRaw')}
                />
                <Input
                  label="Version"
                  placeholder="ex: 1.4.2"
                  className="bg-bg-sunken border-border focus:border-accent"
                  {...register('version')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Format *"
                  options={FORMAT_OPTIONS}
                  error={errors.format?.message}
                  className="bg-bg-sunken border-border focus:border-accent"
                  {...register('format')}
                />
                <Select
                  label="Catégorie"
                  options={CATEGORY_OPTIONS}
                  className="bg-bg-sunken border-border focus:border-accent"
                  {...register('category')}
                />
              </div>

              <div className="pt-2">
                <Select
                  label="Statut initial"
                  options={STATUS_OPTIONS}
                  className="bg-bg-sunken border-border focus:border-accent"
                  {...register('status')}
                />
                <p className="text-[10px] text-text-muted mt-2 font-mono uppercase tracking-widest italic">
                  Identifie tes outils favoris dès maintenant
                </p>
              </div>
            </div>

            {serverError && (
              <div className="p-3 bg-status-doublon-bg/50 border border-status-doublon/20 rounded-xl">
                 <p className="text-xs font-bold text-status-doublon">{serverError}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-8">
              <button 
                type="button" 
                onClick={() => onOpenChange(false)}
                className="px-5 py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
              >
                Annuler
              </button>
              <Button type="submit" loading={loading} className="px-8 shadow-xl shadow-accent/20 h-11">
                Enregistrer le plugin
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
