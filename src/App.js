import "./scss/style.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygonMumbai} from 'wagmi/chains'

function App() {

  const chains = [polygonMumbai]
  const projectId = 'f385bf4e147a499aee6b6c2f17ded944'
  
  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
  })
  const ethereumClient = new EthereumClient(wagmiConfig, chains)


return (
  <>
    <WagmiConfig config={wagmiConfig}>

    <div className="App">
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>

  );
}

export default App;
