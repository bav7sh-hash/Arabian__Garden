'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { REVIEW_LINK } from '@/lib/constants'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderStatusHref?: string | null
}

export function ReviewPopup({ open, onOpenChange, orderStatusHref }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-[#0f0f0f] text-[#f8f9fa]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-center">
              Enjoying the experience?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              We would love your feedback on Google.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-[#d4af37] text-[#050505] hover:bg-[#d4af37]/90"
                asChild
              >
                <a href={REVIEW_LINK} target="_blank" rel="noopener noreferrer">
                  Leave Review
                </a>
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Later
              </Button>
            </div>
            {orderStatusHref && (
              <Button variant="ghost" className="text-[#d4af37]" asChild>
                <Link href={orderStatusHref}>Track order status</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
