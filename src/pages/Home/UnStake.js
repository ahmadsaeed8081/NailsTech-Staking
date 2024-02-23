import { useState } from "react";
import { ArrowIcon } from "../../icons";
import DropDown from "../../component/DropDownUnstake";
import Timer from "../../component/Timer";

import Web3 from "web3";
import {useNetwork,  useSwitchNetwork } from 'wagmi'
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { cont_address,token_Address,cont_abi,token_abi } from "../../component/config";

import { useAccount, useDisconnect } from 'wagmi'


import Modal from "../../component/Modal";
import ConfirmationPopup2 from "../../component/confirmationPopup2";

const UnStake = (props) => {

  const [open, setOpen] = useState(false);


  const [selectedValue, setSelectedValue] = useState("");
  const [choosed_Unstake_inv, set_choosed_Unstake_inv] = useState("");

  const { chain } = useNetwork()

  const { address, isConnecting ,isDisconnected} = useAccount()
  const networkId=80001;

  const { config:unstakeConfig } = usePrepareContractWrite({
    address: cont_address,
    abi: cont_abi,
    functionName: 'unStake',
    args: [choosed_Unstake_inv],
    // gas:300000,

  })


  const { data:data__unstake, isLoading:isLoading_unstake, isSuccess:isSuccess_unstake, write:unstake } = useContractWrite(unstakeConfig)


  const waitForTransaction3 = useWaitForTransaction({
    hash: data__unstake?.hash,
    onSuccess(data) {
    props.test?.()
      console.log('Success2',data )
    },
  })

  const { switchNetwork:unstake_switch } =
  useSwitchNetwork({
    chainId: networkId,
    // throwForSwitchChainNotSupported: true,
    onSuccess(){

      unstake?.()
    }

  })


  function unstaking()
  {
    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }

    if(chain.id!=networkId)
    {
      unstake_switch?.();
    }else{
      unstake?.()

    }
    

  }

  return (
    <div className="unStake-card">
      <div className="box-heading">
        <div className="ls">
          <img src="/images/mask.png"></img>
        </div>
        <div className="rs">NAILS</div>
      </div>
      <div className="unStake-text">
        <div className="info-item">
          <div className="pen-ls">Penalty:</div>
          <div className="pen-rs">10%</div>
        </div>
        <div className="previous-invest">
          <h1>Previous Investment </h1>
          <DropDown
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            allInvestments={props.allInvestments}
            set_choosed_Unstake_inv={set_choosed_Unstake_inv}
          />
        </div>
        <Timer time={Number(selectedValue[1])}/>
        {selectedValue ? (
              <button
                className="approve-btn"
                disabled={isLoading_unstake}
                onClick={(e) => {
                  selectedValue &&
                  Number(props.curr_time) < Number(selectedValue[1])
                    ? setOpen(true)
                    : unstaking();
                }}
              >
                {!isLoading_unstake && !isSuccess_unstake && <div>Unstake</div>}
                {isLoading_unstake && !isSuccess_unstake && (
                  <div>Loading...</div>
                )}
                {!isLoading_unstake && isSuccess_unstake && <div>Unstake</div>}
              </button>
            ) : (
              <button className="approve-btn" >Unstake</button>
            )}
        {/* <button className="approve-btn" >Unstake</button> */}

      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ConfirmationPopup2 setOpen={setOpen} unstaking={unstaking}/>
      </Modal>
    </div>
  );
};

export default UnStake;
