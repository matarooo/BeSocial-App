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
  `flex items-center gap-1.5 rounded-3xl px-2.5 py-1.5 text-xs transition-colors sm:gap-2 sm:px-4 sm:py-1 sm:text-sm ${
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
    <div className='relative flex h-14 w-full max-w-7xl items-center justify-center sm:h-15'>
      <div className='absolute inset-0 rounded-full border border-zinc-900/15 bg-white/60 shadow-xl backdrop-blur-md dark:border-white/20 dark:bg-zinc-900/55'></div>
      <div className='relative z-10 flex h-full w-full items-center justify-between gap-1 px-2 sm:gap-2 sm:px-4'>
      <div className="logo flex shrink-0 items-center justify-center">
        <Comments className='size-7 text-accent'/>
        <span className='hidden pl-2 text-xl font-bold text-zinc-900 dark:text-white min-[380px]:inline sm:text-2xl'>BeSocial</span>
      </div>
      <ul className='flex min-w-0 font-semibold'>
        {userData && (
          <div className='flex gap-0.5 rounded-full border px-0.5 py-1 text-zinc-900 dark:border-white/15 dark:bg-zinc-900/70 dark:text-white sm:gap-2 sm:px-1'>
            <NavLink to={"/"} end aria-label="Feed" title="Feed" className={navLinkClassName}>
            <House className='size-5'/>
            <span className="hidden sm:inline">Feed</span>
            </NavLink>
            <NavLink to={"/profile"} aria-label="Profile" title="Profile" className={navLinkClassName}>
            <Person className='size-5'/>
              <span className="hidden sm:inline">Profile</span>
            </NavLink>
            <NavLink to={"/notifications"} aria-label="Notifications" title="Notifications" className={navLinkClassName}>
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
              <span className="hidden sm:inline">Notifications</span>
            </NavLink>
        </div>
        )}
       
      </ul>
      <div className='flex shrink-0 items-center gap-0.5 sm:gap-2'>
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
            <Link to='/login' className='rounded-full bg-[#ff5005] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#d13f00] sm:px-6 sm:text-sm'>
              Login
            </Link>
            <Link to='/register' className='rounded-full bg-[#ff5005] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#d13f00] sm:px-6 sm:text-sm'>
              Register
            </Link>
          </>
        )}

      </div>
      </div>
    </div>
  )
}
