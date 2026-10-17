import { NavLink, Link } from 'react-router'
import { Moon, Sun ,House ,Person,Bell,Comments} from '@gravity-ui/icons'
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserAuthContext } from '../../Context/UserAuthProvider/UserAuthProvider';
import Avatar from './Avatar';
import { getUnreadNotifications, unreadNotificationsQueryKey } from '../../pages/Notifications/notifications.services';

type NavbarProps = {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-3xl px-4 py-1 transition-colors ${
    isActive
      ? 'bg-accent-soft font-semibold text-accent'
      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/8'
  }`;

export default function Navbar({ isDarkMode, onToggleTheme }: NavbarProps) {
  const { userData } = useContext(UserAuthContext);
  const { data: unreadCount = 0 } = useQuery({
    queryKey: unreadNotificationsQueryKey,
    queryFn: getUnreadNotifications,
    enabled: Boolean(userData),
    refetchInterval: 30_000,
  });
  return (
    <div className='relative flex h-15 w-full max-w-7xl items-center justify-center'>
      <div className='absolute inset-0 rounded-full border border-zinc-900/15 bg-white/60 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-zinc-900/55'></div>
      <div className='relative z-10 flex h-full w-full items-center justify-between px-4'>
      <div className="logo flex items-center justify-center">
        <Comments className='size-7 text-accent'/>
        <span className='pl-2 text-2xl font-bold text-zinc-900 dark:text-white'>BeSocial</span>
      </div>
      <ul className='flex font-semibold'>
        {userData && (
          <div className='flex gap-6 border text-zinc-900 dark:text-white dark:border-white/15 dark:bg-zinc-900/70  py-1 px-1 rounded-full'>
            <NavLink to={"/"} end className={navLinkClassName}>
            <House className='size-5'/>
            Feed
            </NavLink>
            <NavLink to={"/profile"} className={navLinkClassName}>
            <Person className='size-5'/>
              Profile
            </NavLink>
            <NavLink to={"/notifications"} className={navLinkClassName}>
            <span className="relative inline-flex">
              <Bell className='size-5'/>
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread notifications`}
                  className="absolute -right-2 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none text-white"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </span>
              Notifications
            </NavLink>
        </div>
        )}
       
      </ul>
      <div className='flex items-center gap-2'>
          <button
          type='button'
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          className=' cursor-pointer inline-flex size-9 items-center justify-center rounded-full text-zinc-800 transition-colors hover:bg-zinc-900/10 dark:text-zinc-100 dark:hover:bg-white/10'
        >
          {isDarkMode ? <Sun className='size-5' /> : <Moon className='size-5' />}
        </button>
        {userData ? (
          <Avatar />
        ) : (
          <>
            <Link to='/login' className='bg-[#ff5005] text-white px-6 py-1.5 font-bold rounded-full hover:bg-[#d13f00]'>
              Login
            </Link>
            <Link to='/register' className='bg-[#ff5005] text-white px-6 py-1.5 font-bold rounded-full hover:bg-[#d13f00]'>
              Register
            </Link>
          </>
        )}

      </div>
      </div>
    </div>
  )
}
