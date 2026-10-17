import { useEffect, useRef, useState, type ReactNode } from 'react'

export type DropdownListEntry =
  | {
      type: 'item'
      label: string
      icon?: ReactNode
      onSelect?: () => void
      variant?: 'default' | 'danger'
    }
  | {
      type: 'separator'
    }

type DropdownTriggerProps = {
  ref: React.Ref<HTMLButtonElement>
  type: 'button'
  'aria-label': string
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  onClick: () => void
}

type DropdownListProps = {
  ariaLabel: string
  triggerLabel: string
  items: DropdownListEntry[]
  renderTrigger: (props: DropdownTriggerProps) => ReactNode
}

export default function DropdownList({
  ariaLabel,
  triggerLabel,
  items,
  renderTrigger,
}: DropdownListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const triggerProps: DropdownTriggerProps = {
    ref: triggerRef,
    type: 'button',
    'aria-label': triggerLabel,
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    onClick: () => setIsOpen((open) => !open),
  }

  return (
    <div ref={menuRef} className='relative'>
      {renderTrigger(triggerProps)}
      {isOpen && (
        <div
          role='menu'
          aria-label={ariaLabel}
          className='absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-[1.35rem] border border-zinc-200 bg-white p-2.5 text-sm font-semibold text-zinc-900 shadow-2xl shadow-black/15 dark:border-zinc-700/70 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-black/30'
        >
          {items.map((item, index) =>
            item.type === 'separator' ? (
              <div
                key={`separator-${index}`}
                className='my-1.5 border-t border-zinc-200 dark:border-white/6'
              />
            ) : (
              <button
                key={`item-${index}`}
                type='button'
                role='menuitem'
                onClick={() => {
                  setIsOpen(false)
                  item.onSelect?.()
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-1.5 py-2 text-left transition-colors focus-visible:outline-none ${
                  item.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/15 dark:focus-visible:bg-red-500/15'
                    : 'hover:bg-zinc-100 focus-visible:bg-zinc-100 dark:hover:bg-white/8 dark:focus-visible:bg-white/8'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
