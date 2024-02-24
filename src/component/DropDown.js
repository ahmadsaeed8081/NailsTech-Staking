import React, { useState, useEffect } from "react";
import { ArrowIcon } from "../icons";

const DropDown = ({ selectedValue, setSelectedValue }) => {
  const [hide, setHide] = useState(false);
  //   const [selectedValue, setSelectedValue] = useState("");
  const dropDownList = [
    { label: "90 Days", value: "200%", index: "0"},
    { label: "30 Days", value: "100%", index: "1" },
    { label: "7 Days", value: "30%", index: "2" },
  ];
  useEffect(() => {
    setSelectedValue(dropDownList[0])

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
                {selectedValue ? selectedValue.label : "0"}
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
          {dropDownList.map((item, index) => (
            <div
              key={index}
              className="slt flex aic"
              onClick={(e) => {
                setHide(!hide);
                setSelectedValue(item);
              }}
            >
              <div className="unit-name flex aic font w-full s14 b4 justify-between">
                <span className="unit-eng flex aic font s14 b4">
                  {item.label}
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
