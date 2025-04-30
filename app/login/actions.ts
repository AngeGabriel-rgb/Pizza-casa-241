'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

type SignUpPropTypes = {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role: string;
}

export async function signup(formData: SignUpPropTypes) {
  console.log('Registering user:', formData);
  
  
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log('Error signing up:', error);
    
    redirect('/error')
  }


  revalidatePath('/', 'layout')
  redirect('/')
}