import { NavLink } from 'react-router'
import {Folders,BroadcastSignal , Globe ,Bookmark} from '@gravity-ui/icons';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 transition-colors ${
    isActive
      ? 'bg-accent-soft font-semibold text-accent'
      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/8'
  }`;

export default function UserAside() {
  return (
    <div className='w-full flex flex-col gap-6 border border-zinc-900/10 bg-white/80 text-zinc-900 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-white p-5 rounded-4xl'>
      <NavLink to={"/"} end className={navLinkClassName}>
        <Folders className='size-5'/>
        Feed
      </NavLink>
      <NavLink  to={"/myPosts"} end className={navLinkClassName}>
        <BroadcastSignal className='size-5'/>
        My Posts
      </NavLink>
      <NavLink  to={"/community"} end className={navLinkClassName}>
        <Globe className='size-5'/>
        Community
      </NavLink>
      <NavLink to={"/bookmarked"} end className={navLinkClassName}>
        <Bookmark className='size-5'/>
        Saved
      </NavLink>
    </div>
  )
}
