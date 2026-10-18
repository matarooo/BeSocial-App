import { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Shader from '../components/Shader/Shader';
import Navbar from '../components/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserAuthContext } from '../Context/UserAuthProvider/UserAuthProvider';
import UserAside from '../components/Aside/UserAside/UserAside';
import Follow from '../components/Aside/FollowSuggest/Follow';

export default function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('social-app-theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('social-app-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const { userData } = useContext(UserAuthContext);
  return (
    
    <>
      {!userData && <Shader />}
      <header className='fixed inset-x-0 top-0 z-10 flex justify-center px-2 pt-2 text-zinc-900 dark:text-white sm:px-4 sm:pt-4'>
        <Navbar
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((currentMode) => !currentMode)}
        />
      </header>
      <div className='mx-auto max-w-7xl px-2 pb-3.5 pt-20 sm:px-3 sm:pt-28'>
        <main className='min-w-0'>
          <div
            className={
              userData
                ? 'grid min-w-0 gap-3 xl:grid-cols-[220px_minmax(0,1fr)_280px] 2xl:grid-cols-[240px_minmax(0,1fr)_300px] xl:gap-4'
                : 'flex justify-center'
            }
          >
            {userData && (
              <aside className='h-fit min-w-0 xl:sticky xl:top-24'>
                <UserAside />
              </aside>
            )}
            <section
              className={`min-w-0 space-y-4 ${userData ? 'w-full' : 'flex w-full justify-center'}`}
            >
              <Outlet />
            </section>
            {userData && (
              <aside className='hidden h-fit space-y-3 xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden'>
                <Follow />
              </aside>
            )}
          </div>
        </main>
      </div>
      <Toaster position='bottom-right' containerStyle={{ zIndex: 10000 }} />
    </>
  )
}
