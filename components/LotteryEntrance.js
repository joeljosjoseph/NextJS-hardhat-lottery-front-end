import React, { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { Bell, useNotification } from "web3uikit"

function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const {
        isFetching,
        isLoading,
        runContractFunction: enterRaffle,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const newNotification = (s, m, t) => {
        dispatch({
            position: "topR",
            type: t || "info",
            // icon: ,
            title: s,
            message: m,
        })
    }
    async function updateUI() {
        setEntranceFee((await getEntranceFee()).toString())
        setNumPlayers((await getNumberOfPlayers()).toString())
        setRecentWinner((await getRecentWinner()).toString())
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUI()
        newNotification("Transaction Status", "Transaction Complete", "success")
    }
    const handleError = (e) => {
        console.log(e)
        newNotification("Transaction Status", "Transaction Failed", "error")
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
    return (
        <>
            {raffleAddress ? (
                <div className="p-4">
                    <div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 px-5 py-2 text-white font-bold rounded-lg my-4"
                            onClick={async function () {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    onError: (e) => {
                                        handleError(e)
                                    },
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin h-6 w-6 border-b-2 rounded-full"></div>
                            ) : (
                                <>Enter Raffle</>
                            )}
                        </button>
                    </div>
                    <div>
                        <p>
                            Entrance Fee :{" "}
                            {ethers.utils.formatEther(entranceFee, "ether").toString()} ETH
                        </p>
                        <p>Number of Players: {numPlayers}</p>
                        <p>Recent Winner: {recentWinner}</p>
                    </div>
                </div>
            ) : (
                <div>Raffle address not detected!</div>
            )}
        </>
    )
}

export default LotteryEntrance
