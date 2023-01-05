import React from "react"
import { ConnectButton } from "web3uikit"

function Header() {
    return (
        <div className="border-b-2 p-5 flex flex-row justify-between items-center">
            <h1 className="p-4 text-3xl">Decentralized Lottery</h1>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}

export default Header
