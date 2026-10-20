'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AirEasyLogo } from '@/components/brand/AirEasyLogo';
import { Mail, Lock, Check, X, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = hasMinLength && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('Please satisfy all password criteria');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signup(email, password);
      success('Account created successfully! Welcome to AirEasy.');
      router.push('/flights');
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
      toastError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const renderRequirement = (met: boolean, label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
      {met ? (
        <Check size={14} color="var(--color-success)" />
      ) : (
        <X size={14} color="var(--text-muted)" />
      )}
      <span style={{ color: met ? 'var(--color-success)' : 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-block', marginBottom: '16px' }}>
            <AirEasyLogo size="lg" />
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-family-heading)',
            }}
          >
            Create Your Account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Experience swift flight booking &amp; live seat choice
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '13px',
              color: 'var(--color-danger)',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
          />

          {/* Real-time password criteria feedback */}
          <div
            style={{
              background: 'var(--bg-muted)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {renderRequirement(hasMinLength, 'At least 8 characters long')}
            {renderRequirement(hasNumber, 'Contains at least one number')}
            {renderRequirement(hasSpecialChar, 'Contains at least one special character')}
            {renderRequirement(passwordsMatch, 'Passwords match')}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!isValid}
            style={{ width: '100%', marginTop: '8px' }}
            icon={<ArrowRight size={18} />}
          >
            Create Account
          </Button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
