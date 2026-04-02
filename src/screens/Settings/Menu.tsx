import Header from './Header'
import { options } from '../../providers/options'
import Content from '../../components/Content'
import { SettingsSections } from '../../lib/types'
import Menu from '../../components/Menu'
import { TextLabel } from '../../components/Text'
import FlexCol from '../../components/FlexCol'

export default function SettingsMenu() {
  // get rows for Account, Security, App and Advanced sections
  const accountRows = options.filter((o) => o.section === SettingsSections.Account)
  const securityRows = options.filter((o) => o.section === SettingsSections.Security)
  const appRows = options.filter((o) => o.section === SettingsSections.App)
  const advancedRows = options.filter((o) => o.section === SettingsSections.Advanced)

  return (
    <>
      <Header text='Settings' />
      <Content>
        <FlexCol gap='1.25rem'>
          <FlexCol gap='0'>
            <TextLabel>Account</TextLabel>
            <Menu rows={accountRows} styled />
          </FlexCol>
          <FlexCol gap='0'>
            <TextLabel>Security</TextLabel>
            <Menu rows={securityRows} styled />
          </FlexCol>
          <FlexCol gap='0'>
            <TextLabel>App</TextLabel>
            <Menu rows={appRows} styled />
          </FlexCol>
          <FlexCol gap='0'>
            <TextLabel>Advanced</TextLabel>
            <Menu rows={advancedRows} styled />
          </FlexCol>
        </FlexCol>
      </Content>
    </>
  )
}
