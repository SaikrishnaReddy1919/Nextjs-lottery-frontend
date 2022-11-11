import { ConnectButton } from 'web3uikit'

export default function Header() {
  return (
    <div>
      <h3>Decentralized Lottery</h3>
      <ConnectButton moralisAuth={false} />
    </div>
  )
}
