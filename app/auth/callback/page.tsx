// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        router.push('/paiement')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  )
}

/* env 

NEXT_PUBLIC_SUPABASE_URL=https://ebdhukbkquyiwilwlokd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZGh1a2JrcXV5aXdpbHdsb2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Mjc4MzksImV4cCI6MjA2MjIwMzgzOX0.2UxBACmIDXryvBSNsT0x5TXYbZtyihPupDvDEBCAcGY
NEXT_PUBLIC_SITE_URL=http://localhost:3000


# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings


# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.ebdhukbkquyiwilwlokd:kouevidjinange@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.ebdhukbkquyiwilwlokd:kouevidjinange@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
*/