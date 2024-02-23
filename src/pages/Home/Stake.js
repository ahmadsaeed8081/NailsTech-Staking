import { useState,useEffect } from "react";
import { ArrowIcon } from "../../icons";
import DropDown from "../../component/DropDown";


import { cont_address,token_Address,cont_abi,token_abi } from "../../component/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Web3 from "web3";
import {useNetwork,  useSwitchNetwork } from 'wagmi'
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { useAccount, useDisconnect } from 'wagmi'


const Stake = (props) => {
  const [amount, setAmount] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");



  const { chain } = useNetwork()

  const { address, isConnecting ,isDisconnected} = useAccount()
  const networkId=80001;

  const [count, setcount] = useState(0);

    const { data:stakeResult, isLoading:isLoading_stake, isSuccess:stakeSuccess, write:staking } = useContractWrite({

      address: cont_address,
    abi: cont_abi,
    functionName: 'Stake',
    args: [Convert_To_wei(amount),selectedValue.index,props.ref_add],
    onSuccess(data) {
      props.get_data();
      console.log('Success', data)
    },
  

  })

  const { config:appConfig } = usePrepareContractWrite({
    address: token_Address,
    abi: token_abi,
      functionName: 'approve',
      args: [cont_address,Convert_To_wei(amount)],
  })

  const {data:data_app, isLoading:isLoading_app, isSuccess:isSuccess_app,write: approval} = useContractWrite(appConfig)




  const waitForTransaction = useWaitForTransaction({
    hash: data_app?.hash,
    onSuccess(data) {
    staking?.()
      console.log('Success',data )
    },
  })

  const waitForTransaction2 = useWaitForTransaction({
    hash: stakeResult?.hash,
    onSuccess(data) {
    props.get_data?.()
      console.log('Success2',data )
    },
  })




// useEffect(()=>{

//   if(count==0 )
//   {
//       props.get_data()
//       setcount(1);
//   }

// },[address])


  const {switchNetwork:stake_switch } =
    useSwitchNetwork({
      chainId: networkId,
      onSuccess(){

        approval?.()
      }

    })



  


  function Convert_To_wei( val){
    if(val==null || val==undefined || val=="")
    return 

    const web3= new Web3(new Web3.providers.HttpProvider("https://bsc.publicnode.com	"));
    val= web3.utils.toWei(val.toString(),"ether");
    return val;
  
  }

  function Convert_To_eth( val){
    if(val==null || val==undefined || val=="")
    return 

    const web3= new Web3(new Web3.providers.HttpProvider("https://bsc.publicnode.com	"));
    val= web3.utils.fromWei(val.toString(),"ether");
    return val;
  
  }






  async function stake()
  {

    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }

    if(amount==0 )
    {
      alert("kindly write amount to stake ");
      return;
    }
    if(Number(amount)<Number(props.min_stake)/10**18 )
    {
      alert("Minimum Stake amount is "+ Number(props.min_stake)/10**18);
      return;
    }


    if(Number(props.TokenBalance)/10**18 < Number(amount))
    {
      alert("You don't have sufficient balance");
      return;
    }
    if(chain.id!=networkId)
    {
      stake_switch?.();
    }else{
      approval?.()

    }

  }








  return (
    <div className="stake-card">
      <div className="box-heading">
        <div className="stake-ls">
          <img src="/images/mask.png"></img>
        </div>
        <div className="rs">NAILS</div>
      </div>
      <div className="stake-text">
        <div className="info-item">
          <div className="ap-ls">APR:</div>
          <div className="ap-rs">
            {selectedValue ? selectedValue?.value : "0"}
          </div>
        </div>

        <div className="choose-day">
          <h1>Choose Look</h1>
          <DropDown
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
          {/* <div className="day-input">
            <div className="day">350 Days</div>
            <div className="arrow">
              <ArrowIcon />
            </div>
          </div> */}
        </div>

        <div className="field-amount">
          <div className="ls-fld">Select Amount:</div>
          <div className="rs-fld">Balance: {(Number(props.TokenBalance)/10**18).toFixed(2)} NT</div>
        </div>
        <div className="balance">
          <input
            className="num"
            type="number"
            value={amount}
            placeholder="0.0"
            min={0}
            max={(Number(props.TokenBalance)/10**18).toFixed(2)}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="balance-btn">
            <button className="plp-btn">NT</button>
            <button className="max-btn" onClick={(e) => setAmount(props.TokenBalance ? (Number(props.TokenBalance)/10**18).toFixed(2) : 0)}>Max</button>
          </div>
        </div>
        <button
              disabled={isLoading_app || isLoading_stake}
              className="approve-btn"
              onClick={stake}
            >
              {!isLoading_stake &&
                !isLoading_app &&
                !isSuccess_app &&
                !stakeSuccess && <div>Approve</div>}
              {isLoading_app && <div>Approving</div>}
              {!stakeSuccess && !isLoading_stake && isSuccess_app && (
                <div>Approved</div>
              )}
              {isLoading_stake && <div>Staking</div>}
              {!isLoading_app && stakeSuccess && <div>Approve</div>}
            </button>
        {/* <button className="approve-btn" onClick={stake}>Approve</button> */}

        <div className="approve-button"></div>
      </div>
    </div>
  );
};

export default Stake;
