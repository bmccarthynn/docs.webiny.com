import "../css/fonts.css";
import "../css/main.css";
import "focus-visible";
import { useState, useEffect, Fragment } from "react";
import { Header } from "@/components/Header";
import { Title } from "@/components/Title";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import Head from "next/head";
import socialCardLarge from "@/img/webiny-social-share.jpg";
import { ResizeObserver } from "@juggle/resize-observer";
import { SearchProvider } from "@/components/Search";
const { WTS } = require("wts/src/web");

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
    window.ResizeObserver = ResizeObserver;
}

const progress = new ProgressBar({
    size: 2,
    color: "#38bdf8",
    className: "bar-of-progress",
    delay: 100
});

// this fixes safari jumping to the bottom of the page
// when closing the search modal using the `esc` key
if (typeof window !== "undefined") {
    progress.start();
    progress.finish();
}

Router.events.on("routeChangeStart", () => progress.start());
Router.events.on("routeChangeComplete", () => progress.finish());
Router.events.on("routeChangeError", () => progress.finish());

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
    // For the first page load
    setTimeout(async () => {
        if (window.heap) {
            window.wts = new WTS();
            window.wts.identify();
        }
    }, 500);

    // Subsequent route changes
    Router.onRouteChangeComplete = _url => {
        // Webiny Telemetry System
        // trigger telemetry when changing routes

        if (window.wts) {
            window.wts.identify();
        }
    };
}

export default function App({ Component, pageProps, router }) {
    let [navIsOpen, setNavIsOpen] = useState(false);

    useEffect(() => {
        if (!navIsOpen) return;
        function handleRouteChange() {
            setNavIsOpen(false);
        }
        Router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            Router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [navIsOpen]);

    const Layout = Component.layoutProps?.Layout || Fragment;
    const layoutProps = Component.layoutProps?.Layout
        ? { layoutProps: Component.layoutProps, navIsOpen, setNavIsOpen }
        : {};
    const showHeader = router.pathname !== "/";
    const meta = Component.layoutProps?.meta || {};
    const description =
        meta.metaDescription || meta.description || "Documentation for the Webiny CMS.";

    if (router.pathname.startsWith("/examples/")) {
        return <Component {...pageProps} />;
    }

    return (
        <>
            <Title suffix="Webiny Docs">{meta.metaTitle || meta.title}</Title>
            <Head>
                <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
                <meta key="twitter:site" name="twitter:site" content="@WebinyCMS" />
                <meta key="twitter:description" name="twitter:description" content={description} />
                <meta name="description" content={description} />
                <meta
                    key="twitter:image"
                    name="twitter:image"
                    content={`https://www.webiny.com${socialCardLarge}`}
                />
                <meta key="twitter:creator" name="twitter:creator" content="@WebinyCMS" />
                <meta
                    key="og:url"
                    property="og:url"
                    content={`https://www.webiny.com${router.pathname}`}
                />
                <meta key="og:type" property="og:type" content="article" />
                <meta key="og:description" property="og:description" content={description} />
                <meta
                    key="og:image"
                    property="og:image"
                    content={`https://www.webiny.com${socialCardLarge}`}
                />
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title="RSS 2.0"
                    href="/feeds/feed.xml"
                />
                <link
                    rel="alternate"
                    type="application/atom+xml"
                    title="Atom 1.0"
                    href="/feeds/atom.xml"
                />
                <link
                    rel="alternate"
                    type="application/json"
                    title="JSON Feed"
                    href="/feeds/feed.json"
                />
            </Head>
            <SearchProvider>
                {showHeader && (
                    <Header
                        hasNav={Boolean(Component.layoutProps?.Layout?.nav)}
                        navIsOpen={navIsOpen}
                        onNavToggle={isOpen => setNavIsOpen(isOpen)}
                    />
                )}
                <Layout {...layoutProps}>
                    <Component {...pageProps} />
                </Layout>
            </SearchProvider>
        </>
    );
}
