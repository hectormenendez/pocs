import React from "react"; // needed for the JSX to work

import { Footer } from "./Footer.js";
import { Header } from "./Header.js";

export function Layout({ children }) {
    return (
        <html>
            <head>
                <title>My Blog</title>
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer author="Hector Menendez" />
            </body>
        </html>

    )
}
