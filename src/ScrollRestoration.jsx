import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = new Map();

export default function ScrollRestoration() {
    const location = useLocation();
    const navigationType = useNavigationType();

    // Save scroll position continuously
    useEffect(() => {
        const saveScroll = () => {
            scrollPositions.set(location.key, window.scrollY);
        };

        window.addEventListener("scroll", saveScroll);

        return () => {
            window.removeEventListener("scroll", saveScroll);
        };
    }, [location.key]);

    // Restore when going back
    useEffect(() => {
        if (navigationType !== "POP") {
            return;
        }

        const savedPosition = scrollPositions.get(location.key);

        if (savedPosition === undefined) {
            return;
        }

        let attempts = 0;

        const restore = () => {
            attempts++;

            window.scrollTo(0, savedPosition);

            // Keep trying while the page is being built
            if (
                window.scrollY !== savedPosition &&
                attempts < 60
            ) {
                requestAnimationFrame(restore);
            }
        };

        requestAnimationFrame(restore);

        return () => {
            attempts = 60;
        };
    }, [location.key, navigationType]);

    return null;
}