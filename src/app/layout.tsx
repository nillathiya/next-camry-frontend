import NoSsr from "@/utils/NoSsr";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getServerSession } from "next-auth";
import { ToastContainer } from "react-toastify";
import "../index.scss";
import { authOptions } from "./api/auth/[...nextauth]/authOption";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";
import MainProvider from "./MainProvider";
import Web3Provider from "./Web3Provider";
import InitialApiProvider from "./InitialApiProvider";
import SessionWrapper from "@/common-components/SessionWrapper";
import ErrorBoundary from "@/common-components/ErrorBoundry";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lng = await detectLanguage();
  const session = await getServerSession(authOptions);

  return (
    <I18nProvider language={lng}>
      <html lang={lng}>
        <head>
          <title>Camry</title>
          <link
            rel="icon"
            href={`/assets/images/logo/logo-icon.png`}
            type="image/x-icon"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&amp;family=Nunito+Sans:ital,wght@0,300;0,400;0,700;0,800;0,900;1,700&amp;display=swap"
            rel="stylesheet"
          />
          {/* <script
            src="https://maps.googleapis.com/maps/api/js?key=your_api_key"
            async
          ></script> */}
        </head>
        <body suppressHydrationWarning={true}>
          <ErrorBoundary>
            <NoSsr>
            <SessionWrapper session={session}>
              <Web3Provider>
                <MainProvider>
                  <InitialApiProvider>
                    {/* <SpeedInsights /> */}
                    <ToastContainer />
                    {children}
                  </InitialApiProvider>
                </MainProvider>
              </Web3Provider>
            </SessionWrapper>
            </NoSsr>
          </ErrorBoundary>
        </body>
      </html>
    </I18nProvider>
  );
}
