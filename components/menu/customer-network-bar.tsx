'use client'

import { useNetworkStatus } from '@/hooks/use-network-status'

export function CustomerNetworkBar() {
  const online = useNetworkStatus()

  return (
    <div className="flex flex-col gap-1 text-xs sm:text-sm">
      <div className="flex items-center gap-2 text-gray-300">
        <span aria-hidden>{online ? '🟢' : '🔴'}</span>
        <span>{online ? 'Online' : 'Offline'}</span>
      </div>
      {!online && (
        <p className="text-amber-200/90 max-w-[220px] leading-snug">
          Connection lost. Orders will be sent when internet returns.
        </p>
      )}
    </div>
  )
}
