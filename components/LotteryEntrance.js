import { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { abi, contractAddresses } from '../constants'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit'

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //chainId in hex format
  const chainId = parseInt(chainIdHex)
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null
  console.log(chainId, raffleAddress)
  const [entranceFee, setEntranceFee] = useState('0')
  const dispatch = useNotification()

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee,
  })

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

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
  }

  const handleNewNotification = async function (tx) {
    dispatch({
      type: 'info',
      message: 'Transaction complete',
      title: 'Transaction notification',
      position: 'topR',
    })
  }
  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (e) => console.log(e),
              })
            }}
          >
            Enter Raffle
          </button>
          Entrance fee : {ethers.utils.formatUnits(entranceFee, 'ether')}ETH
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
