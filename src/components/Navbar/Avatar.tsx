import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowRightFromSquare,
  Gear,
  Person,
} from '@gravity-ui/icons'
import { UserAuthContext } from '../../Context/UserAuthProvider/UserAuthProvider'
import DropdownList, { type DropdownListEntry } from '../DropdownList/DropdownList'

export default function Avatar() {
  const { userData, setUserData } = useContext(UserAuthContext)
  const [hasImageError, setHasImageError] = useState(false)
  const navigate = useNavigate()

  if (!userData) return null

  const initials = userData.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  function handleLogout() {
    localStorage.removeItem('token')
    setUserData(null)
    navigate('/login', { replace: true })
  }

  function handlePreferences() {
    navigate('/settings')
  }

  const menuItems: DropdownListEntry[] = [
    {
      type: 'item',
      label: 'Your account',
      icon: <Person aria-hidden='true' className='size-4.5 shrink-0 text-zinc-500 dark:text-zinc-400' />,
    },
    {
      type: 'item',
      label: 'Preferences',
      icon: <Gear aria-hidden='true' className='size-4.5 shrink-0 text-zinc-500 dark:text-zinc-400' />,
      onSelect: handlePreferences,
    },
    { type: 'separator' },
    {
      type: 'item',
      label: 'Log out',
      icon: (
        <ArrowRightFromSquare
          aria-hidden='true'
          className='size-4.5 shrink-0 text-zinc-500 dark:text-zinc-400'
        />
      ),
      onSelect: handleLogout,
    },
  ]

  return (
    <DropdownList
      ariaLabel='Account menu'
      triggerLabel='Open account menu'
      items={menuItems}
      renderTrigger={(triggerProps) => (
        <button
          {...triggerProps}
          className='flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-zinc-200 text-sm font-semibold text-zinc-700 shadow-sm transition hover:ring-2 hover:ring-[#ff5005] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5005] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white'
        >
          {userData.photo && !hasImageError ? (
            <img
              src={userData.photo}
              alt=''
              className='size-full object-cover'
              onError={() => setHasImageError(true)}
            />
          ) : (
            initials || <Person aria-hidden='true' className='size-5' />
          )}
        </button>
      )}
    />
  )
}
