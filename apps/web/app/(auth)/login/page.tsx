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
  password: z.string().min(1, 'Mot de passe requis'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
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
        '/api/v1/auth/login',
        data,
        false
      )
      setAuth(res.data.user, res.data.token)
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur de connexion')
    }
  }

  return (
    <div style={{
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
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Layers size={24} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
            PluginBase
          </span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
          Connecte-toi à ton espace
        </p>
      </div>

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
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={isSubmitting} style={{ width: '100%', marginTop: 4 }}>
          Se connecter
        </Button>
      </form>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
        Pas encore de compte ?{' '}
        <Link href="/register" style={{ color: 'var(--accent-text)', fontWeight: 500, textDecoration: 'none' }}>
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
