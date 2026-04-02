import { useContext } from 'react'
import Header from './Header'
import Content from '../../components/Content'
import Padded from '../../components/Padded'
import FlexCol from '../../components/FlexCol'
import { TextSecondary } from '../../components/Text'
import Toggle from '../../components/Toggle'
import { WalletContext } from '../../providers/wallet'
import { isBiometricsSupported, registerUser } from '../../lib/biometrics'
import { consoleLog } from '../../lib/logs'
import { hapticSubtle } from '../../lib/haptics'

export default function Biometric() {
  const { updateWallet, wallet } = useContext(WalletContext)

  const biometricsSupported = isBiometricsSupported()
  const biometricsEnabled = wallet.lockedByBiometrics || false

  const handleToggle = () => {
    hapticSubtle()
    
    if (biometricsEnabled) {
      // Disable biometrics
      updateWallet({ ...wallet, lockedByBiometrics: false, passkeyId: undefined })
    } else {
      // Enable biometrics
      registerUser()
        .then(({ passkeyId }) => {
          updateWallet({ ...wallet, lockedByBiometrics: true, passkeyId })
        })
        .catch(consoleLog)
    }
  }

  return (
    <>
      <Header text='Biometric Authentication' back />
      <Content>
        <Padded>
          <FlexCol gap='1.5rem'>
            {!biometricsSupported ? (
              <TextSecondary>
                Biometric authentication is not supported on this device
              </TextSecondary>
            ) : (
              <Toggle
                checked={biometricsEnabled}
                onClick={handleToggle}
                text='Use Biometrics'
                subtext='When enabled, you can use fingerprint or face recognition to unlock your wallet instead of entering a password'
              />
            )}
          </FlexCol>
        </Padded>
      </Content>
    </>
  )
}
