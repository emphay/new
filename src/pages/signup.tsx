import React from "react"

export default function SignUp() {

    return (
        <form method="post" action="/api/signup">

            <label>
                Username
                <input name="username" type="text" />
            </label>
            <label>
                Email
                <input name="email" type="email" />
            </label>
            <label>
                Password
                <input name="password" type="password" />
            </label>
            <button type="submit">Sign up</button>
        </form>
    )
}
