'use client';

import { BarChart, Book, LogIn, Settings, User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define user interface
interface UserData {
  isLoggedIn: boolean;
  userName?: string;
}

const UserMenu: React.FC = () => {
  // State for user data
  const [userData, setUserData] = useState<UserData>({
    isLoggedIn: false,
    userName: '',
  });

  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State for logout processing
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/user');

        if (!response.ok) {
          // If response is not OK, assume user is not logged in
          setUserData({ isLoggedIn: false });
          return;
        }

        const data = await response.json();
        setUserData({
          isLoggedIn: true,
          userName: data.name || 'User',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // On error, assume user is not logged in
        setUserData({ isLoggedIn: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Send POST request to logout endpoint
      const response = await fetch('/api/v1/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include CSRF token if your backend requires it
        // credentials: 'include' ensures cookies are sent with the request
        credentials: 'include',
      });

      if (response.ok) {
        // Update local state
        setUserData({ isLoggedIn: false });

        // Clear any client-side storage if needed
        // localStorage.removeItem('user-related-item');

        // Optional: Redirect to home page or login page
        // router.push('/');

        // Force reload to ensure all components reflect logged out state
        // Uncomment if needed - less ideal for SPAs but sometimes necessary
        // window.location.href = '/';
      } else {
        console.error('Logout failed');
        // Optionally show an error notification to the user
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white'>
        <span className='mr-2'>Loading...</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
        {userData.isLoggedIn ? (
          <>
            <span className='mr-2'>{userData.userName}</span>
            <User className='w-4 h-4' />
          </>
        ) : (
          <>
            <span className='mr-2'>Account</span>
            <User className='w-4 h-4' />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {userData.isLoggedIn ? (
          <>
            <DropdownMenuItem asChild>
              <Link href='/profile' className='flex items-center'>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/my-flashcards' className='flex items-center'>
                <Book className='mr-2 h-4 w-4' />
                <span>My Flashcards</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/my-progress' className='flex items-center'>
                <BarChart className='mr-2 h-4 w-4' />
                <span>My Progress</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings' className='flex items-center'>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            {/* Replace Link with button for logout */}
            <DropdownMenuItem
              onSelect={(e) => {
                // Prevent closing the dropdown before we're ready
                e.preventDefault();
                handleLogout();
              }}
            >
              <button
                disabled={isLoggingOut}
                className='flex items-center w-full text-left'
              >
                <LogIn className='mr-2 h-4 w-4' />
                <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href='/login' className='flex items-center'>
                <LogIn className='mr-2 h-4 w-4' />
                <span>Sign in</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/register' className='flex items-center'>
                <User className='mr-2 h-4 w-4' />
                <span>Register</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
