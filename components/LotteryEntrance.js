import { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { abi, contractAddresses } from '../constants'
import { ethers } from 'ethers'
export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //chainId in hex format
  const chainId = parseInt(chainIdHex)
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null
  console.log(chainId, raffleAddress)
  const [entranceFee, setEntranceFee] = useState('0')

  // const { runContractFunction: enterRaffle } = useWeb3Contract({
  //     abi: abi,
  //     contractAddress: raffleAddress,
  //     functionName: "enterRaffle",
  //     params: {},
  //     msgValue :
  // })

  const { runContractFunction: getEntracnceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getEntracnceFee',
    params: {},
  })

  useEffect(() => {
    if (isWeb3Enabled) {
      //read get entrance fee
      async function updateUI() {
        const entranceFee = (await getEntracnceFee()).toString()
        setEntranceFee(entranceFee)
      }
      updateUI()
    }
  }, [isWeb3Enabled])
  return (
    <div>Entrance fee : {ethers.utils.formatUnits(entranceFee, 'ether')}</div>
  )
}
