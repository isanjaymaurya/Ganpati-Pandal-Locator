import Head from 'next/head';

import useIsDesktop from '@/hooks/useIsDesktop';
import Header from '@/components/Header/Header';
import DesktopFooter from '@/components/Footer/DesktopFooter';

const MainLayout = ({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
}) => {
    const pageTitle = title ?? 'Ganpati Pandal Locator';
    const pageDescription =
        description ??
        'Discover and navigate to Ganpati pandals near you during Ganesh Chaturthi. Browse an interactive map, search the full pandal directory, save favourites, and get Google Maps directions — all in one place.';
    const isDesktop = useIsDesktop();
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
            </Head>
            <Header isDesktop={isDesktop} />
            <main className="container mx-auto">
                {children}
            </main>
            <DesktopFooter />
            {/* hidding BottomNavigation bcoz i dont find more pages which need it */}
        </>
    );
};

export default MainLayout;