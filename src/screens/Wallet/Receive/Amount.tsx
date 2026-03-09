import { useContext, useEffect, useState } from 'react'
import Button from '../../../components/Button'
import ButtonsOnBottom from '../../../components/ButtonsOnBottom'
import { FlowContext, TransferMethod } from '../../../providers/flow'
import Padded from '../../../components/Padded'
import ErrorMessage from '../../../components/Error'
import { getReceivingAddresses } from '../../../lib/asp'
import { extractError } from '../../../lib/error'
import Header from '../../../components/Header'
import InputAmount from '../../../components/InputAmount'
import Content from '../../../components/Content'
import FlexCol from '../../../components/FlexCol'
import Keyboard from '../../../components/Keyboard'
import { WalletContext } from '../../../providers/wallet'
import { callFaucet, pingFaucet } from '../../../lib/faucet'
import Loading from '../../../components/Loading'
import { prettyAmount, prettyNumber } from '../../../lib/format'
import Success from '../../../components/Success'
import { consoleError } from '../../../lib/logs'
import { AspContext } from '../../../providers/asp'
import { isMobileBrowser } from '../../../lib/browser'
import { ConfigContext } from '../../../providers/config'
import { FiatContext } from '../../../providers/fiat'
import { LimitsContext } from '../../../providers/limits'
import { LightningContext } from '../../../providers/lightning'
import { InfoLine } from '../../../components/Info'
import Dropdown from '../../../components/Dropdown'
import QrCode from '../../../components/QrCode'
import ExpandAddresses from '../../../components/ExpandAddresses'
import { canBrowserShareData, shareData } from '../../../lib/share'
import { NotificationsContext } from '../../../providers/notifications'
import { encodeBip21 } from '../../../lib/bip21'
import {
  RECEIVE_METHOD_FEES_TEXT,
  RECEIVE_METHOD_TIME_TEXT,
  RECEIVE_METHOD_WARNING_TEXT,
  TRANSFER_METHOD,
  TRANSFER_METHOD_LABELS,
  TRANSFER_METHOD_OPTIONS,
} from '../../../lib/transferMethods'

export default function ReceiveAmount() {
  const { aspInfo } = useContext(AspContext)
  const { config, useFiat } = useContext(ConfigContext)
  const { toFiat } = useContext(FiatContext)
  const { recvInfo, setRecvInfo } = useContext(FlowContext)
  const { notifyPaymentReceived } = useContext(NotificationsContext)
  const { arkadeLightning, createReverseSwap, calcReverseSwapFee } = useContext(LightningContext)
  const {
    amountIsAboveMaxLimit,
    amountIsBelowMinLimit,
    validLnSwap,
    validUtxoTx,
    validVtxoTx,
    utxoTxsAllowed,
    vtxoTxsAllowed,
  } = useContext(LimitsContext)
  const { balance, svcWallet, wallet } = useContext(WalletContext)

  const [error, setError] = useState('')
  const [fauceting, setFauceting] = useState(false)
  const [faucetSuccess, setFaucetSuccess] = useState(false)
  const [faucetAvailable, setFaucetAvailable] = useState(false)
  const [satoshis, setSatoshis] = useState(0)
  const [showKeys, setShowKeys] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [invoice, setInvoice] = useState(recvInfo.invoice ?? '')
  const [qrValue, setQrValue] = useState('')
  const [bip21uri, setBip21uri] = useState('')
  const [showQrCode, setShowQrCode] = useState(false)

  const selectedMethod = recvInfo.method ?? TRANSFER_METHOD.bitcoin

  useEffect(() => {
    setError(aspInfo.unreachable ? 'Ark server unreachable' : '')
  }, [aspInfo.unreachable])

  useEffect(() => {
    pingFaucet(aspInfo)
      .then(setFaucetAvailable)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!svcWallet) return
    getReceivingAddresses(svcWallet)
      .then(({ offchainAddr, boardingAddr }) => {
        if (!offchainAddr) throw 'Unable to get offchain address'
        if (!boardingAddr) throw 'Unable to get boarding address'
        setRecvInfo({
          ...recvInfo,
          boardingAddr,
          offchainAddr,
          method: recvInfo.method ?? TRANSFER_METHOD.bitcoin,
        })
      })
      .catch((err) => {
        const error = extractError(err)
        consoleError(error, 'error getting addresses')
        setError(error)
      })
  }, [svcWallet])

  if (!svcWallet) return <Loading text='Loading...' />

  const handleChange = (sats: number) => {
    setSatoshis(sats)
    const value = useFiat ? toFiat(sats) : sats
    const maximumFractionDigits = useFiat ? 2 : 0
    setTextValue(prettyNumber(value, maximumFractionDigits, false))
    setRecvInfo({ ...recvInfo, satoshis: sats })
  }

  const handleFaucet = async () => {
    try {
      if (!satoshis) throw 'Invalid amount'
      setFauceting(true)
      const ok = await callFaucet(recvInfo.offchainAddr, satoshis, aspInfo)
      if (!ok) throw 'Faucet failed'
      setFauceting(false)
      setFaucetSuccess(true)
    } catch (err) {
      consoleError(err, 'error fauceting')
      setError(extractError(err))
      setFauceting(false)
    }
  }

  const handleFocus = () => {
    if (isMobileBrowser) setShowKeys(true)
  }

  // manage all possible receive methods
  const { boardingAddr, offchainAddr } = recvInfo
  const allowUtxo = validUtxoTx(satoshis) && utxoTxsAllowed()
  const allowVtxo = validVtxoTx(satoshis) && vtxoTxsAllowed()
  const allowLn = validLnSwap(satoshis)

  const address = selectedMethod === TRANSFER_METHOD.bitcoin ? (allowUtxo ? boardingAddr : '') : ''
  const arkAddress = selectedMethod === TRANSFER_METHOD.ark ? (allowVtxo ? offchainAddr : '') : ''
  const useLightning = selectedMethod === TRANSFER_METHOD.lightning ? allowLn : false
  const noPaymentMethods = !address && !arkAddress && !useLightning
  const showFaucetButton = balance === 0 && faucetAvailable
  const showLightningFees = satoshis && selectedMethod === TRANSFER_METHOD.lightning
  const reverseSwapFee = calcReverseSwapFee(satoshis)
  const lightningFeeText = `Lightning fees: ${prettyAmount(reverseSwapFee)}`
  const methodTimeInfo = `Transfer time: ${RECEIVE_METHOD_TIME_TEXT[selectedMethod]}`
  const methodFeesInfo = `Fees: ${RECEIVE_METHOD_FEES_TEXT[selectedMethod]}`
  const methodWarningInfo = RECEIVE_METHOD_WARNING_TEXT[selectedMethod]

  const disabled = !canBrowserShareData({ title: 'Receive', text: qrValue }) || sharing

  // set the QR code value to the bip21uri the first time
  useEffect(() => {
    const nextBip21 = encodeBip21(address, arkAddress, invoice, satoshis)
    setBip21uri(nextBip21)
    setQrValue(nextBip21)
    if (invoice) setShowQrCode(true)
  }, [invoice, address, arkAddress, satoshis])

  useEffect(() => {
    if (invoice) {
      setShowQrCode(true)
      return
    }

    if (useLightning && wallet && svcWallet && arkadeLightning) {
      createReverseSwap(satoshis)
        .then((pendingSwap) => {
          if (!pendingSwap) throw new Error('Failed to create reverse swap')
          const invoice = pendingSwap.response.invoice
          setRecvInfo({ ...recvInfo, invoice })
          setInvoice(invoice)
          arkadeLightning
            .waitAndClaim(pendingSwap)
            .then(() => {
              setRecvInfo({ ...recvInfo, satoshis: pendingSwap.response.onchainAmount })
              notifyPaymentReceived(pendingSwap.response.onchainAmount)
            })
            .catch((error) => {
              setShowQrCode(true)
              consoleError(error, 'Error claiming reverse swap:')
            })
        })
        .catch((error) => {
          setShowQrCode(true)
          consoleError(error, 'Error creating reverse swap:')
        })
    } else {
      setShowQrCode(true)
    }
  }, [satoshis, arkadeLightning, invoice, useLightning])

  useEffect(() => {
    if (!svcWallet) return

    const listenForPayments = (event: MessageEvent) => {
      let incomingSats = 0
      if (event.data && event.data.type === 'VTXO_UPDATE') {
        const newVtxos = event.data.newVtxos as { value: number }[]
        incomingSats = newVtxos.reduce((acc, v) => acc + v.value, 0)
      }
      if (event.data && event.data.type === 'UTXO_UPDATE') {
        const coins = event.data.coins as { value: number }[]
        incomingSats = coins.reduce((acc, v) => acc + v.value, 0)
      }
      if (incomingSats) {
        setRecvInfo({ ...recvInfo, satoshis: incomingSats })
        notifyPaymentReceived(incomingSats)
      }
    }

    navigator.serviceWorker.addEventListener('message', listenForPayments)

    return () => {
      navigator.serviceWorker.removeEventListener('message', listenForPayments)
    }
  }, [svcWallet])

  const handleShare = () => {
    setSharing(true)
    shareData({ title: 'Receive', text: qrValue })
      .catch(consoleError)
      .finally(() => setSharing(false))
  }

  if (showKeys) {
    return <Keyboard back={() => setShowKeys(false)} hideBalance onSats={handleChange} value={satoshis} />
  }

  if (fauceting) {
    return (
      <>
        <Header text='Fauceting' />
        <Content>
          <Loading text='Getting sats from a faucet. This may take a few moments.' />
        </Content>
      </>
    )
  }

  if (faucetSuccess) {
    const displayAmount = useFiat ? prettyAmount(toFiat(satoshis), config.fiat) : prettyAmount(satoshis ?? 0)
    return (
      <>
        <Header text='Success' />
        <Content>
          <Success headline='Faucet completed!' text={`${displayAmount} received successfully`} />
        </Content>
      </>
    )
  }

  if (showKeys) {
    return <Keyboard back={() => setShowKeys(false)} hideBalance onSats={handleChange} value={satoshis} />
  }

  return (
    <>
      <Header text='Receive' back />
      <Content>
        <Padded>
          <FlexCol>
            <ErrorMessage error={Boolean(error)} text={error} />
            <Dropdown
              label='Transfer method'
              labels={TRANSFER_METHOD_OPTIONS.map((option) => TRANSFER_METHOD_LABELS[option])}
              onChange={(value) => setRecvInfo({ ...recvInfo, method: value as TransferMethod, invoice: undefined })}
              options={TRANSFER_METHOD_OPTIONS}
              selected={selectedMethod}
            />
            <InputAmount
              name='receive-amount'
              focus={!isMobileBrowser}
              label='Amount'
              onSats={handleChange}
              onFocus={handleFocus}
              readOnly={isMobileBrowser}
              value={textValue ? Number(textValue) : undefined}
              sats={satoshis}
            />
            {methodWarningInfo ? <InfoLine color='orange' text={methodWarningInfo} /> : null}
            {showLightningFees ? <InfoLine color='orange' text={lightningFeeText} /> : null}
            {methodTimeInfo ? <InfoLine text={methodTimeInfo} /> : null}
            {methodFeesInfo ? <InfoLine text={methodFeesInfo} /> : null}
            {selectedMethod === TRANSFER_METHOD.bank ? (
              <InfoLine color='orange' text='Bank transfers are handled in Transfers' />
            ) : null}
            {selectedMethod !== TRANSFER_METHOD.bank ? (
              noPaymentMethods ? (
                <div>No valid payment methods available for this amount</div>
              ) : showQrCode ? (
                <FlexCol centered>
                  {invoice ? <InfoLine centered color='orange' text='Keep tab open to receive Lightning' /> : null}
                  <QrCode value={qrValue} />
                  <ExpandAddresses
                    bip21uri={bip21uri}
                    boardingAddr={address}
                    offchainAddr={arkAddress}
                    invoice={invoice}
                    onClick={setQrValue}
                  />
                </FlexCol>
              ) : (
                <Loading text='Generating QR code...' />
              )
            ) : null}
          </FlexCol>
        </Padded>
      </Content>
      <ButtonsOnBottom>
        {selectedMethod !== TRANSFER_METHOD.bank ? <Button label='Share' onClick={handleShare} disabled={disabled} /> : null}
        {showFaucetButton ? <Button disabled={!satoshis} label='Faucet' onClick={handleFaucet} secondary /> : null}
      </ButtonsOnBottom>
    </>
  )
}
