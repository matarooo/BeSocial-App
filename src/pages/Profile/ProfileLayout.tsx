import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router";

export default function ProfileLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
      const savedTheme = localStorage.getItem('social-app-theme');
      return savedTheme ? savedTheme === 'dark' : true;
    });
  
    useEffect(() => {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('social-app-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
  return (
    <>
    <header className='fixed inset-x-0 top-0 z-10 flex justify-center px-4 pt-4 text-zinc-900 dark:text-white'>
            <Navbar
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode((currentMode) => !currentMode)}
            />
    </header>
    <Outlet/>
    </>
  )
}
