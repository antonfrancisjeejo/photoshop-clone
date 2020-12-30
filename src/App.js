import React, { useState } from "react";
import "./App.css";
import SidebarItem from "./components/SidebarItem";
import Slider from "./components/Slider";
import * as htmlToImage from "html-to-image";
import * as download from "downloadjs";

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue Rotate",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20,
    },
    unit: "px",
  },
];

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [image, setImage] = useState(null);

  const selectedOption = options[selectedIndex];

  const handleSliderChange = ({ target }) => {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedIndex) return option;
        return { ...option, value: target.value };
      });
    });
  };

  const applyFilters = () => {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return {
      filter: filters.join(" "),
      backgroundImage: `url(${image})`,
    };
  };

  const downloadResume = () => {
    htmlToImage
      .toPng(document.getElementById("image"))
      .then(function (dataUrl) {
        download(dataUrl, `${Date.now()}.png`);
      });
  };

  const handleImage = (event) => {
    const objectUrl = URL.createObjectURL(event.target.files[0]);
    setImage(objectUrl);
  };

  return (
    <div className="container">
      {image ? (
        <div className="main-image" style={applyFilters()} id="image" />
      ) : (
        <div className="upload-image">
          <h1>Photoshop Clone</h1>
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>
      )}
      <div className="sidebar">
        {options.map((option, index) => {
          return (
            <SidebarItem
              key={index}
              name={option.name}
              active={index === selectedIndex}
              handleClick={() => setSelectedIndex(index)}
            />
          );
        })}
        <button onClick={downloadResume} className="download">
          Download
        </button>
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />
    </div>
  );
};

export default App;
