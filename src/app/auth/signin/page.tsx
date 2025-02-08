"use client"
import React, { useRef } from 'react';
import { signIn } from "next-auth/react";

export default function SignIn() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const SigninWithEmail = async (e: any) => {
        e.preventDefault();
        await signIn("credentials", {
            redirect: true,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            callbackUrl: "/",
        });
    };

    const SigninWithGoogle = async (e: any) => {
        e.preventDefault();
        await signIn("google", {
            redirect: true,
            callbackUrl: "/",
        });
    };

    return (
        <section className="bg-gray-50 h-[93vh] flex items-center justify-center text-black">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Sign in</h1>
                <form className="space-y-4 mt-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                        <input type="email" id="email" className="w-full p-2 border rounded-lg" placeholder="name@company.com" required ref={emailRef} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                        <input type="password" id="password" className="w-full p-2 border rounded-lg" placeholder="••••••••" required ref={passwordRef} />
                    </div>
                    <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700" onClick={SigninWithEmail}>Sign in with Email</button>
                    <button className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700" onClick={SigninWithGoogle}>Sign in with Google</button>
                </form>
                <p className="text-sm text-center mt-4">
                    Don’t have an account? <a href="/auth/signup" className="text-blue-600 hover:underline">Sign up</a>
                </p>
            </div>
        </section>
    );
}