import { OnboardStaggerContainer, OnboardStaggerChild } from '../components/OnboardLoadIn'
import SuccessIcon from '../icons/Success'
import CenterScreen from './CenterScreen'
import FlexCol from './FlexCol'
import Text from './Text'
import { ReactNode } from 'react'

interface SuccessProps {
  headline?: string
  text?: string
  icon?: ReactNode
}

export default function Success({ headline, text, icon }: SuccessProps) {
  return (
    <CenterScreen>
      <OnboardStaggerContainer>
        <OnboardStaggerChild>
          <FlexCol centered gap='1rem'>
            {icon || <SuccessIcon />}
            {headline ? (
              <Text centered big medium heading wrap>
                {headline}
              </Text>
            ) : null}
            {text ? (
              <Text centered thin small wrap>
                {text}
              </Text>
            ) : null}
          </FlexCol>
        </OnboardStaggerChild>
      </OnboardStaggerContainer>
    </CenterScreen>
  )
}
