import Head from 'next/head';

import BottomNavigation from '@/components/BottomNavigation/BottomNavigation';
import useIsDesktop from '@/hooks/useIsDesktop';
import MobileHeader from '@/components/Header/MobileHeader';
import DesktopHeader from '@/components/Header/DesktopHeader';
import DesktopFooter from '@/components/Footer/DesktopFooter';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const isDesktop = useIsDesktop();
    return (
        <>
            <Head>
                <title>Ganpati Pandal Locator</title>
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