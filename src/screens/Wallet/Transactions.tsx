import Content from '../../components/Content'
import Header from '../../components/Header'
import Padded from '../../components/Padded'
import TransactionsList from '../../components/TransactionsList'

export default function Transactions() {
  return (
    <>
      <Header text='All Transactions' back />
      <Content>
        <Padded>
          <TransactionsList />
        </Padded>
      </Content>
    </>
  )
}
