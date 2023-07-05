import React from "react";

import { Footer } from "./Footer.js";
import { Header } from "./Header.js";

export function Layout({ children }) {
    return (
        <html>
            <head>
                <title>My Blog</title>
                <script src="/assets/client.js" type="module"></script>
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer author="Hector Menendez" />
            </body>
        </html>

    )
}
