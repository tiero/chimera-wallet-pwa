import { useContext, useState } from 'react'
import Text, { TextSecondary } from './Text'
import ErrorMessage from './Error'
import Button from './Button'
import Padded from './Padded'
import Content from './Content'
import FlexCol from './FlexCol'
import CenterScreen from './CenterScreen'
import { consoleError } from '../lib/logs'
import InputPassword from './InputPassword'
import ButtonsOnBottom from './ButtonsOnBottom'
import { WalletContext } from '../providers/wallet'
import { authenticateUser } from '../lib/biometrics'
import LockIcon from '../icons/Lock'

interface NeedsPasswordProps {
  error: string
  onPassword: (password: string) => void
  loading?: boolean
}

export default function NeedsPassword({ error, onPassword, loading = false }: NeedsPasswordProps) {
  const { wallet } = useContext(WalletContext)
  const [password, setPassword] = useState('')
  const [usePasswordFallback, setUsePasswordFallback] = useState(false)

  const handleBiometrics = () => {
    authenticateUser(wallet.passkeyId)
      .then(onPassword)
      .catch((err) => {
        consoleError(err, 'Biometric authentication failed')
        // Automatically show password fallback on biometric failure
        setUsePasswordFallback(true)
      })
  }

  const handleChange = (ev: any) => setPassword(ev.target.value)
  const handleClick = () => onPassword(password)

  const showPasswordInput = !wallet.lockedByBiometrics || usePasswordFallback

  return (
    <>
      <Content>
        <Padded>
          {showPasswordInput ? (
            <FlexCol gap='1rem'>
              <InputPassword
                focus
                label='Insert password'
                onChange={handleChange}
                onEnter={handleClick}
                placeholder='password'
              />
              <ErrorMessage text={error} error={Boolean(error)} />
              {wallet.lockedByBiometrics && usePasswordFallback ? (
                <TextSecondary wrap>
                  Note: If biometrics was enabled, you'll need to disable it from Settings first or restore your wallet using your private key.
                </TextSecondary>
              ) : null}
            </FlexCol>
          ) : (
            <CenterScreen onClick={handleBiometrics}>
              <LockIcon big />
              <Text centered>Unlock with your passkey</Text>
            </CenterScreen>
          )}
        </Padded>
      </Content>
      <ButtonsOnBottom>
        {showPasswordInput ? (
          <Button onClick={handleClick} label='Unlock wallet' loading={loading} disabled={loading} />
        ) : (
          <Button onClick={handleBiometrics} label='Unlock using biometrics' loading={loading} disabled={loading} />
        )}
      </ButtonsOnBottom>
    </>
  )
}
