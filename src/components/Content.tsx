import { IonContent } from '@ionic/react'
import { ReactNode, useEffect, useRef } from 'react'
import Refresher from './Refresher'

interface ContentProps {
  children: ReactNode
}

export default function Content({ children }: ContentProps) {
  const contentRef = useRef<HTMLIonContentElement>(null)

  useEffect(() => {
    // Scroll to top when component mounts
    contentRef.current?.scrollToTop(0)
  }, [])

  return (
    <IonContent ref={contentRef}>
      <Refresher />
      <div style={{ height: '100%', paddingTop: '2rem' }}>{children}</div>
    </IonContent>
  )
}
