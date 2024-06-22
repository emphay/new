import { getCsrfToken, signIn } from "next-auth/react"
import { Router, useRouter } from "next/router";
import React from "react"

export default function SignIn() {

    const router = useRouter();
    const handleSignIn = async (event: any) => {
        event.preventDefault();

        const data = {
            username: event.target.elements.username.value,
            password: event.target.elements.password.value
        }
        await signIn('credentials', {
            redirect: true,
            callbackUrl: '/',
            ...data
        })
    };



    return (
        <form onSubmit={handleSignIn}>
            {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
            <label>
                Username
                <input name="username" type="text" />
            </label>
            <label>
                Password
                <input name="password" type="password" />
            </label>
            <button type="submit">Sign in</button>
        </form>
    )
}


