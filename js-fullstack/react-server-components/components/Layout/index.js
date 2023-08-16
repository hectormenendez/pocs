import React from "react";

import { Footer } from "./Footer.js";
import { Header } from "./Header.js";

export function Layout({ children }) {
    return (
        <html>
            <head>
                <title>My Blog</title>
                <script type="importmap">
                    {{
                        "imports": {
                            "react": "https://esm.sh/react@canary?dev",
                            "react-dom/client": "https://esm.sh/react-dom@canary/client?dev"
                        }
                    }}
                </script>
                <script type="module" src="/assets/client.js"></script>
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer author="Hector Menendez" />
            </body>
        </html>

    )
}
