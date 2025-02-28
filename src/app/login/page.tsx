'use client';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const data = {
      username: username,
      password: password,
      credentials: 'include',
    };

    try {
      const endpoint = '/api/v1/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message);
      }

      window.location.href = '/';
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <div className='w-full max-w-md shadow-lg border rounded-lg bg-white'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                name='username'
                type='text'
                required
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className='text-center mt-4'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <Link
                  href='/register'
                  className='text-blue-600 hover:underline'
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </div>
    </Card>
  );
};

export default LoginForm;
