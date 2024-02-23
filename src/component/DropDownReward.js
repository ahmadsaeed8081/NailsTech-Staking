import React, { useState, useEffect } from "react";
import { ArrowIcon } from "../icons";
import Timer from "../component/Timer";

const DropDown = ({ selectedValue, setSelectedValue,allInvestments,set_choosed_stake_inv }) => {
  const [hide, setHide] = useState(false);
  //   const [selectedValue, setSelectedValue] = useState("");
  const dropDownList = [
    { label: "90 Days", value: "90%" },
    { label: "60 Days", value: "60%" },
    { label: "7 Days", value: "30%" },
  ];
  useEffect(() => {
    if(allInvestments[0]!=undefined)
    {
      setSelectedValue(allInvestments[0])
    }
    document.addEventListener("click", () => {
      setHide(false);
    });
  }, []);
  return (
    <div className="dropDown">
      <div className="category">
        <div
          className="cbox cleanbtn"
          onClick={(e) => {
            e.stopPropagation();
            setHide(!hide);
          }}
        >
          <div className="slt">
            <div className="unit-name font s14 b4">
              <span className="unit-eng  font s14 b4" placeholder="Plano">
                {selectedValue ? Number(selectedValue[0])/10**18 : "0"}
              </span>
            </div>
          </div>

          <div className="arrow-icon flex items-center justify-center">
            <ArrowIcon />
          </div>
        </div>
      </div>
      <div className={`block flex aic abs ${hide ? "show" : ""}`}>
        <div className="manue flex aic col anim">
          {allInvestments.map((item, index) => (
            <div
              key={index}
              className="slt flex aic"
              onClick={(e) => {
                setHide(!hide);
                // alert(item[0])
                setSelectedValue(item);
                set_choosed_stake_inv(item[3])
              }}
            >
              <div className="unit-name flex aic font w-full s14 b4 justify-between">
                <span className="unit-eng flex aic font s14 b4">
                  {Number(item[0])/10**18}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default DropDown;
