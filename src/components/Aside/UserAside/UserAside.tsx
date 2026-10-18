import { NavLink } from 'react-router'
import {Folders,BroadcastSignal , Globe ,Bookmark,Persons} from '@gravity-ui/icons';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors xl:w-full ${
    isActive
      ? 'bg-accent-soft font-semibold text-accent'
      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/8'
  }`;

export default function UserAside() {
  return (
    <nav aria-label="Feed navigation" className='flex w-full gap-1 overflow-x-auto rounded-2xl border border-zinc-900/10 bg-white/80 p-2 text-zinc-900 shadow-sm backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/15 dark:bg-zinc-900/70 dark:text-white xl:flex-col xl:gap-3 xl:overflow-visible xl:rounded-4xl xl:p-5'>
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
      <NavLink to={"/suggestions"} end className={navLinkClassName}>
        <Persons className='size-5'/>
        Suggestions
      </NavLink>
    </nav>
  )
}
