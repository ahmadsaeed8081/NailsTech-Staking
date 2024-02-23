import React, { useState,useEffect } from "react";
import { WalletIcon, LinkIcon, ArrowIcon } from "../../icons";
import Stake from "./Stake";
import UnStake from "./UnStake";
import Reward from "./Reward";
import { useLocation } from 'react-router-dom';

import { useWeb3Modal } from "@web3modal/react";
import Loader from "../../component/Loader";

// import { useAccount, useContractReads, useContractWrite } from "wagmi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {PiCopySimpleFill} from 'react-icons/pi';
import 'react-toastify/dist/ReactToastify.css';


import { cont_address,token_Address,cont_abi,token_abi } from "../../component/config";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import Web3 from "web3";
import {useNetwork,  useSwitchNetwork } from 'wagmi'

import { useAccount, useDisconnect } from 'wagmi'





const tabs = [
  {
    label: "Stake",
    value: "stake",
  },
  {
    label: "UnStake",
    value: "unstake",
  },
  {
    label: "Reward",
    value: "reward",
  },
];

const Home = () => {
  const [amount, setAmount] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const { open, close } = useWeb3Modal();
  // const { address, isConnected } = useAccount();
  const [loader, setLoader] = useState(false);

  const notify = () => toast("Referral is Copied Successfully!");



  const [totalRefIncome, set_totalRefIncome] = useState(0);

  
  const [totalReward, set_totalReward] = useState(0);
  const [Total_withdraw, set_Total_withdraw] = useState(0);
  
  
  const [totalInvestment, set_totalInvestment] = useState(0);
  const [totalEarning, set_totalEarning] = useState(0);
  
  const [ref_add, set_ref] = useState("0x0000000000000000000000000000000000000000");
  
  const [TokenBalance, set_TokenBalance] = useState(0);
  
  
  const [choosed_Unstake_inv, set_choosed_Unstake_inv] = useState();
  const [allInvestments, set_investmentList] = useState([]);
  const [reward_allInvestments, set_reward_investmentList] = useState([]);
  
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [directs, set_directs] = useState(0);
  const [curr_time, set_curr_time] = useState(0);
  
  
  const [min_stake, set_min_stake] = useState(0);

  
  // const [count, set_count] = useState(0);
  
  const { chain } = useNetwork()
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const _ref = params.get("ref");
  
  const { address, isConnecting ,isConnected,isDisconnected} = useAccount()
  let count=0
  
  
  
  useEffect(()=>{
  if(count==0&& address!=undefined)
  {
    if(_ref!=null)
    {
      set_ref(_ref)
    }

    count++;
  
      get_data();
  }
  
  },[address,ref_add])
  
  
  
  async function get_data(){
    setLoader(true)
    const web3= new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai-bor.publicnode.com	"));
  
              
   const balance =await  web3.eth.getBalance(address)
    const contract=new web3.eth.Contract(cont_abi,cont_address);
    const contract1=new web3.eth.Contract(token_abi,token_Address);
  
    let TokenBalance = await contract1.methods.balanceOf(address).call();    
    
    let min_stakeAmount = await contract.methods.minimum_investment().call();    
    // let min_Withlimit = await contract.methods.minimum_withdraw_reward_limit().call();    
    // let max_Withlimit = await contract.methods.maximum_withdraw_reward_limit().call();
    
    

    
    let totalReward = await contract.methods.get_TotalReward(address).call();   
    
    let TotalInvestment = await contract.methods.getTotalInvestment().call({ from: address }); 
    
 
    let totalEarning = await contract.methods.get_totalEarning(address).call(); 
    

    let Total_withdraw = await contract.methods.total_withdraw_reaward(address).call();
    

  
    let user = await contract.methods.user(address).call();      
    
    let curr_time = await contract.methods.get_currTime().call();      

  
    let allInvestments = await contract.methods.getAll_investments().call({from: address});
    

    let allInvestments_reward = await contract.methods.getAll_investments_ForReward().call({from: address});
  
    
    set_curr_time(curr_time)
    set_totalRefIncome(user[4])
    set_TokenBalance(TokenBalance);
  
    set_totalInvestment(TotalInvestment)
    set_totalEarning(totalEarning)
  
  
    set_min_stake(min_stakeAmount)
    // set_minWithdraw(min_Withlimit)
    // set_maxWithdraw(max_Withlimit)
    set_directs(user[6])
    set_reward_investmentList(allInvestments_reward)
    set_investmentList(allInvestments);
    setSelectedAmount(allInvestments[0]);
    if(allInvestments[0])
    {
      set_choosed_Unstake_inv(allInvestments[0][3])
  
    }    
    set_totalReward(totalReward);
    set_Total_withdraw(Total_withdraw);
  
    setLoader(false)
  
  
  console.log("object done");
  }  
  
  










  return (
    <>
      <div className="header">
        <div className="wrapper app-width">
          <div className="ls">
            <img src="/images/logo.png" className="logo"></img>
          </div>
          <div className="rs ">
            {/* <button className="wallet-btn">
              <span className="icon">
                <WalletIcon />
              </span>
              Connect Wallet
            </button> */}
            <button className="wallet-btn" type="button" onClick={() => open()}> {isConnected
            ? address.slice(0, 5) + "..." + address.slice(38, 42)
            : "Connect Wallet"}</button>
          </div>
        </div>
      </div>

      {/* home */}
      <div className="home">
        <div className="wrapper app-width">
          <div className="ls">
            <div className="ls-circle"></div>
            <div
              className="buttons"
              style={{ backgroundImage: `url(/images/bg.png)` }}
            >
              {tabs.map((item) => (
                <button
                  className={`link stake ${
                    activeTab === item.value ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {/* <Stake />
            <UnStake />
            <Reward /> */}

            {activeTab === "stake" ? (
              <Stake TokenBalance={TokenBalance} ref_add={ref_add} get_data={get_data} min_stake={min_stake} />
            ) : activeTab === "unstake" ? (
              <UnStake get_data={get_data} allInvestments={allInvestments}  curr_time={curr_time}/>
            ) : (
              <Reward get_data={get_data} allInvestments={reward_allInvestments} totalEarning={totalEarning} Total_withdraw={Total_withdraw} />
            )}
          </div>
          <div className="rs">
            <div className="rs-circle"></div>

            <div className="payment-box">
              <div className="tol_invest">
                <h1 className="invest">Total Investment</h1>
                <div className="total-num">{Number(totalInvestment)/10**18}</div>
              </div>
              <div className="tol_Ear">
                <h1 className="earning"> Referral Earning</h1>
                <div className="total-num">{Number(totalRefIncome)/10**18}</div>
              </div>
              <div className="tol_Bal">
                <h1 className="balance">Total Withdraw</h1>
                <div className="total-num">{Number(Total_withdraw)/10**18}</div>
              </div>
              <div className="tol_Ref">
                <h1 className="referr">Total Directs</h1>
                <div className="total-num">{Number(directs)}</div>
              </div>
            </div>
            <div className="link-box">
              <div className="text">
                <h1 className="link-name">My Link</h1>
                <div className="link_icon">
                <CopyToClipboard text={`${window.location.origin}/?ref=${address}`} >
                        <button className="copy-icon flex items-center justify-center" >
                          <PiCopySimpleFill color='white' className=' text-2xl'  onClick={notify}/>
                        </button>

                </CopyToClipboard>  
                  {/* <LinkIcon /> */}
                </div>
              </div>
              <div className="url"> {window.location.origin}/?ref={address?address.slice(0,4)+"...."+address.slice(38,42):"kindly connect"}</div>
            </div>
          </div>
        </div>
      </div>
      {loader && <Loader />}
      <ToastContainer/>

    </>
  );
};

export default Home;
