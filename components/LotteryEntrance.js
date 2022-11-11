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
  const [numPlayers, setnumPlayers] = useState('0')
  const [recentWinner, setrecentWinner] = useState('0')

  const dispatch = useNotification()

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
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

  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getNumOfPlayers',
    params: {},
  })
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
    params: {},
  })

  // TODO: listen for 'WinnerPicked' event and automatically update UI.

  async function updateUI() {
    const entranceFee = (await getEntracnceFee()).toString()
    const numPlayersCall = (await getNumPlayers()).toString()
    const recentWinnerCall = await getRecentWinner()
    setEntranceFee(entranceFee)
    setrecentWinner(recentWinnerCall)
    setnumPlayers(numPlayersCall)
  }

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleNewNotification = async function (tx) {
    dispatch({
      type: 'info',
      message: 'Transaction complete',
      title: 'Transaction notification',
      position: 'topR',
    })
  }
  return (
    <div className="p-5">
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess, // this is not the txn success but it tell wether the txn is submitted to metamask or not. If yes, it means success
                onError: (e) => console.log(e),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              'Enter Raffle'
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
          </div>
          <div>The current number of players is: {numPlayers}</div>
          <div>The most previous winner was: {recentWinner}</div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
