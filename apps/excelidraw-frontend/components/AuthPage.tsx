"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '@/app/config';
import { useRouter } from 'next/navigation';

interface AuthPageProps {
  isSignin: boolean;
}

interface FormData {
  name?: string;
  username: string;
  password: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  password?: string;
}

export default function AuthPage({ isSignin }: AuthPageProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    

    try {
        if (isSignin) {
            console.log(formData)
              const res = await axios.post(`${BACKEND_URL}/signin`, formData);
              if (res.status === 200){
                router.push('/');
              }
          } else {
              const res = await axios.post(`${BACKEND_URL}/signup`, formData);
              if (res.status === 200){
                router.push('/');
              }
          }
      } catch (error) {
          console.error("API call failed:", error);
  
          // Handle specific axios error types
          if (axios.isAxiosError(error)) {
              if (error.response) {
                  console.error("Error data:", error.response.data);
                  console.error("Error status:", error.response.status);
                  console.error("Error headers:", error.response.headers);
                  alert(`Error: ${error.response.data.message || 'An unexpected error occurred.'}`);
              } else if (error.request) {
                  console.error("No response received:", error.request);
                  alert("Network error: No response from server. Check if backend is running and CORS is configured.");
              } else {
                  console.error("Axios config error:", error.message);
                  alert(`Error: ${error.message}`);
              }
          } else {
              alert("An unknown error occurred.");
          }
      }


    
    // Handle success (in real app, this would redirect)
    console.log(isSignin ? 'Sign in successful' : 'Sign up successful', formData);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-105 transition-transform duration-200">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              {isSignin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 text-lg">
              {isSignin 
                ? 'Sign in to your account to continue' 
                : 'Join us today and start your journey'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Only for Sign Up */}
            {!isSignin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.username && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>
            </div>

            

            {/* Remember Me / Forgot Password */}
            {isSignin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Switch Page Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {isSignin ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  href={isSignin ? '/signup' : '/signin'}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                >
                  {isSignin ? 'Sign up' : 'Sign in'}
                </Link>
              </p>
            </div>

            
          </form>

          
        </div>
      </div>
    </div>
  );
}