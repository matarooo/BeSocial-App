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
      <header className='fixed inset-x-0 top-0 z-10 flex justify-center px-4 pt-4 text-zinc-900 dark:text-white'>
        <Navbar
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((currentMode) => !currentMode)}
        />
      </header>
      <div className='mx-auto max-w-7xl px-3 pb-3.5 pt-28'>
        <main className='min-w-0'>
          <div
            className={
              userData
                ? 'grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]'
                : 'flex justify-center'
            }
          >
            {userData && (
              <aside className='h-fit space-y-3 xl:sticky xl:top-24 xl:block'>
                <UserAside />
              </aside>
            )}
              <section
                className={`space-y-4 ${userData ? 'w-full' : 'flex w-full justify-center'}`}
              >
                <Outlet />
              </section>
            {userData && (
              <aside className='h-fit space-y-3 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden xl:block'>
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
