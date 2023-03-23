import React, { ReactNode, useId, useRef, useState } from 'react'
import { FloatingPortal, useFloating, FloatingArrow, arrow, shift } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: ReactNode
  renderPopover: ReactNode
  className?: string
}

export default function Popover({ children, renderPopover, className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const id = useId()

  const { x, y, strategy, refs, context, middlewareData } = useFloating({
    middleware: [
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement: 'bottom-end'
  })

  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }

  return (
    <div className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duaration: 0.2 }}
            >
              <FloatingArrow ref={arrowRef} context={context} fill='white' />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}
