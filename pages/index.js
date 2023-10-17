import { useUser } from '@auth0/nextjs-auth0/client';

import { setSession, clearSession } from 'utils/session';

import Footer from '../components/Footer';
import Products from '../components/Products';
import Navigation from '../components/Navigation';

import MyCarousel from '@/components/MyCarousel';
import { StyledEngineProvider } from '@mui/material/styles';




export default function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {

    //setSession(user);

    return (
      <>
        <Navigation sessionId={ setSession(user) }/>
        <main>
          {/* figure out how to conditionally render carousel only on home page/the collection  */}
          <StyledEngineProvider injectFirst>
            <MyCarousel />
          </StyledEngineProvider>
       
          <Products />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation  />
      <main>
      <StyledEngineProvider injectFirst>
            <MyCarousel />
          </StyledEngineProvider>

        <Products />
      </main>
      <Footer />
    </>
  );
}