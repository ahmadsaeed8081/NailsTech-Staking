import React, { useState } from "react";
import { ArrowIcon } from "../../icons";
import DropDown from "../../component/DropDownReward";

import {useNetwork,  useSwitchNetwork } from 'wagmi'

import { useAccount, useDisconnect } from 'wagmi'
import { useContractReads,  useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { cont_address,token_Address,cont_abi,token_abi } from "../../component/config";


const Reward = (props) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [choosed_stake_inv, set_choosed_stake_inv] = useState("");

  const { address, isConnecting ,isConnected,isDisconnected} = useAccount()
  const { chain } = useNetwork()


  const { data:stakeResult_withdrawReward,isLoading: isLoading2_withdrawReward,isSuccess: isSuccess2_withdrawReward, write:withdrawReward } = useContractWrite({
  
    address: cont_address,
    abi: cont_abi,
    functionName: 'withdrawReward',                                                           
  
  })
  
  const networkId=80001;
  
  
   const waitForTransaction4 = useWaitForTransaction({
      hash: stakeResult_withdrawReward?.hash,
      onSuccess(data) {
        props.get_data()
        console.log('Success2',data )
      },
    })
  
    const { chains, error, isLoading, pendingChainId, switchNetwork:reward_switch } =
    useSwitchNetwork({
      chainId: networkId,
      onSuccess(){

        withdrawReward?.()

      }
  
    })





  function withdraw()
  {
    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }

    if(((Number(props.totalEarning))/10**18) <= 0)
    {
      alert("You dont have enough balance");
      return;
    }
    if(chain.id!=networkId)
    {
      reward_switch?.();
    }else{
      withdrawReward?.()

    }
    // console.log(data__unstake);
    

  }


  
  return (
    <div className="reward-card">
      <div className="box-heading">
        <div className="ls">
          <img src="/images/mask.png"></img>
        </div>
        <div className="rs">NAILS</div>
      </div>
      <div className="reward-text">
        <div className="info-item">
          <div className="earn-ls">Total Earning</div>
          <div className="num" style={{ color:"white" }}>{(Number(props.totalEarning)/10**18).toFixed(2)}</div>
        </div>
        {/* <div className="droan-filed">
          <div className="withdroan-text">Total Withdroan</div>
          <div className="num">{}</div>
        </div> */}
        <div className="claim-filed">
          <div className="claim-text">Available to Claim:</div>
          <div className="" style={{ color:"white" }}>{((Number(props.totalEarning)- Number(props.Total_withdraw))/10**18).toFixed(2)}</div>
        </div>
        <div className="reward-invest">
          <h1>Investment History</h1>
          <DropDown
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            allInvestments={props.allInvestments}
            set_choosed_stake_inv={set_choosed_stake_inv}
          />
        </div>

        <div className="eam-filed">
          <div className="" style={{ color:"white" }}>Earning:</div>
          <div className="" style={{ color:"white" }}>{(Number(selectedValue[6])/10**18).toFixed(2)}</div>
        </div>
        <button className="approve-btn" onClick={withdraw}>
              {!isLoading2_withdrawReward && !isSuccess2_withdrawReward && (
                <div>Claim</div>
              )}
              {isLoading2_withdrawReward && !isSuccess2_withdrawReward && (
                <div>Loading...</div>
              )}
              {!isLoading2_withdrawReward && isSuccess2_withdrawReward && (
                <div>Claim</div>
              )}
            </button>
        {/* <button className="approve-btn" onClick={withdraw}>Claim</button> */}
      </div>
    </div>
  );
};

export default Reward;
