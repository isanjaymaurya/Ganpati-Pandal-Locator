import Head from 'next/head';

import BottomNavigation from '@/components/BottomNavigation/BottomNavigation';
import useIsDesktop from '@/hooks/useIsDesktop';
import MobileHeader from '@/components/Header/MobileHeader';
import DesktopHeader from '@/components/Header/DesktopHeader';
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
            {isDesktop ? <DesktopHeader /> : <MobileHeader />}
            <main className="container mx-auto">
                {children}
            </main>
            {isDesktop ? <DesktopFooter /> : <BottomNavigation />}
        </>
    );
};

export default MainLayout;