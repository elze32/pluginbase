'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post<{ data: { user: { id: string; email: string; createdAt: string }; token: string } }>(
        '/api/v1/auth/register',
        { email: data.email, password: data.password },
        false
      )
      setAuth(res.data.user, res.data.token)
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création du compte')
    }
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--bg-surface)',
        borderRadius: 14,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Layers size={24} color="var(--accent)" />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 20,
              color: 'var(--text-primary)',
            }}
          >
            PluginBase
          </span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Crée ton espace en quelques secondes
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Email"
          type="email"
          placeholder="toi@studio.fr"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Mot de passe"
          type="password"
          placeholder="8 caractères minimum"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirme le mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" loading={isSubmitting} style={{ width: '100%', marginTop: 4 }}>
          Créer mon compte
        </Button>
      </form>

      {/* Footer */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Déjà un compte ?{' '}
        <Link
          href="/login"
          style={{ color: 'var(--accent-text)', fontWeight: 500, textDecoration: 'none' }}
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
