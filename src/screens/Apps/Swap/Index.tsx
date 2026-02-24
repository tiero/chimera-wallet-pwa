import { useContext, useState, useEffect } from 'react'
import { NavigationContext, Pages } from '../../../providers/navigation'
import AppTermsPage from '../AppTermsPage'
import SwapForm from './SwapForm'
import type { AppTerms } from '../../../lib/appConfig'

const SWAP_TERMS_ACCEPTED_KEY = 'swap_terms_accepted'

type SwapStep = 'terms' | 'form'

// Swap terms configuration following the AppTerms interface
const swapTerms: AppTerms = {
  title: 'Swap - Terms & Conditions',
  content: `Welcome to Chimera Swap

With swaps you can exchange your assets for Bitcoin and receive them in your non custodial wallet.

The swap service is provided by external partners and is subject to the partner terms and conditions including limitation on availability on certain countries or KYC verification requirements.`,
  checkboxLabel: 'I have read and agree to the Terms of Service',
}

export default function AppSwap() {
  const { navigate } = useContext(NavigationContext)
  const [step, setStep] = useState<SwapStep>('terms')

  useEffect(() => {
    // Check if terms have been accepted previously
    const termsAccepted = localStorage.getItem(SWAP_TERMS_ACCEPTED_KEY)
    if (termsAccepted === 'true') {
      setStep('form')
    }
  }, [])

  const handleBack = () => {
    navigate(Pages.Apps)
  }

  const handleTermsAccept = () => {
    localStorage.setItem(SWAP_TERMS_ACCEPTED_KEY, 'true')
    setStep('form')
  }

  switch (step) {
    case 'terms':
      return (
        <AppTermsPage
          appName='Swap'
          terms={swapTerms}
          onAccept={handleTermsAccept}
          onBack={handleBack}
        />
      )
    case 'form':
      return <SwapForm onBack={handleBack} />
    default:
      return null
  }
}
