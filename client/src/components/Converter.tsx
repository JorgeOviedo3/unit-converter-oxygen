import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { addConversion } from "../redux/conversionsSlice";

import exchangewhite from "../assets/exchangeWhite.svg";
import heart from "../assets/heart.svg";

const unitsDictionary: {
  [key: string]: { from: string; to: string; method: (value: number) => number };
} = {
  kmtomiles: {
    from: "km",
    to: "miles",
    method: (km) => km * 0.621371,
  },
  milestokm: {
    from: "miles",
    to: "km",
    method: (miles) => miles * 1.60934,
  },
  feettometers: {
    from: "feet",
    to: "meters",
    method: (feet) => feet * 0.3048,
  },
  meterstofeet: {
    from: "meters",
    to: "feet",
    method: (meters) => meters * 3.28084,
  },
  centimeterstoinches: {
    from: "centimeters",
    to: "inches",
    method: (centimeters) => centimeters * 0.393701,
  },
  inchestocentimeters: {
    from: "inches",
    to: "centimeters",
    method: (inches) => inches * 2.54,
  },
};

const Converter = () => {
  const [initialValue, setInitialValue] = useState(0);
  const [resultValue, setResultValue] = useState(0);
  const [selected, setSelected] = useState("kmtomiles");

  const dispatch = useDispatch<AppDispatch>();

  const handleFlipSelected = () => {
    const flippedKey = Object.keys(unitsDictionary).find(
      (key) => key === `${selected.split("to")[1]}to${selected.split("to")[0]}`
    );
    if (!flippedKey) return;
    setSelected(flippedKey);
    setInitialValue(resultValue);
    setResultValue(initialValue);
  };

  const handleSaveConversion = () => {
    const initialUnit = unitsDictionary[selected].from;
    const resultUnit = unitsDictionary[selected].to;
    if (
      !initialUnit ||
      !resultUnit ||
      !initialValue ||
      !resultValue ||
      isNaN(initialValue) ||
      isNaN(resultValue) ||
      initialValue <= 0 ||
      resultValue <= 0
    ) {
      return;
    }
    dispatch(addConversion({ initialValue, initialUnit, resultValue, resultUnit }));
  };

  useEffect(() => {
    setResultValue(parseFloat(unitsDictionary[selected].method(initialValue).toFixed(2)));
  }, [selected, initialValue]);

  return (
    <section id="converter">
      <div className="container">
        <div className="converter-card">
          <div className="converter-card__header">
            <h1>convert</h1>
          </div>
          <div className="converter-card__body">
            <div className="converter-card__body__left">
              <select
                name="select"
                id="select"
                onChange={(e) => setSelected(e.target.value)}
                value={selected}
              >
                {Object.keys(unitsDictionary).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {unitsDictionary[key].from} → {unitsDictionary[key].to}
                    </option>
                  );
                })}
              </select>
              <img src={exchangewhite} alt="exchange icon" onClick={() => handleFlipSelected()} />
            </div>
            <div className="converter-card__body__right">
              <input
                type="number"
                placeholder="0"
                value={initialValue}
                onChange={(e) => setInitialValue(Number(e.target.value))}
              />
              <span>{unitsDictionary[selected].from}</span>
            </div>
          </div>
          <div className="converter-card__footer">
            <img
              src={heart}
              alt="heart icon"
              className="save-button"
              onClick={() => handleSaveConversion()}
            />
            <div className="converter-card__footer__right">
              <span className="value">{resultValue}</span>{" "}
              <span className="unit">{unitsDictionary[selected].to}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Converter;
