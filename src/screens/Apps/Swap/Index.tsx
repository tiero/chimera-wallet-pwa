import { useContext } from 'react'
import { NavigationContext, Pages } from '../../../providers/navigation'
import CenterScreen from '../../../components/CenterScreen'
import FlexCol from '../../../components/FlexCol'
import Text, { TextSecondary } from '../../../components/Text'
import ComingSoonIcon from '../../../icons/ComingSoon'
import Content from '../../../components/Content'
import Padded from '../../../components/Padded'
import Header from '../../../components/Header'

export default function AppSwap() {
  const { navigate } = useContext(NavigationContext)

  const handleBack = () => {
    navigate(Pages.Apps)
  }

  return (
    <>
      <Header text="Swap" back={handleBack} />
      <Content>
        <Padded>
          <CenterScreen>
            <FlexCol centered gap='1rem'>
              <ComingSoonIcon />
              <FlexCol centered gap='0.5rem'>
                <Text heading>Coming Soon</Text>
                <TextSecondary>The swap service is temporarily unavailable. Please check back later.</TextSecondary>
              </FlexCol>
            </FlexCol>
          </CenterScreen>
        </Padded>
      </Content>
    </>
  )
}
