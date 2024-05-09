import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictions, setPredictions] = useState(null);

  const inputRef = useRef();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else setSelectedImage(null);
  };

  const handleInput = () => {
    inputRef.current.click();
  };

  const hanldeSubmit = async (event) => {
    event.preventDefault();
    setPredictions(null);
    const url = "https://7764-34-125-239-243.ngrok-free.app/";
    const formData = new FormData();
    formData.append("image", event.target.image.files[0]);

    try {
      const response = await fetch(`${url}/predict`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.predictions);
        setPredictions(data.predictions);
      } else {
        console.error("Request failed:", response.status);
        setPredictions(null);
      }
    } catch (error) {
      setPredictions(null);
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="main">
      <header>
        <div className="image">
          <img src="/logo.png" alt="logo" />
        </div>
        <h1>Medicinal Plant</h1>
      </header>
      <main>
        <div className="container">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="preview-image"
              onClick={handleInput}
            />
          )}
          <div className="input">
            <h1 onClick={handleInput}>Upload an Image</h1>
            <form onSubmit={hanldeSubmit}>
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleImageChange}
                ref={inputRef}
              />
              <button type="submit" value="Predict">
                Predict
              </button>
            </form>
          </div>
          <div className="predict"></div>
        </div>
        {predictions?.length && (
          <div className="prediction">
            <h2>Prediction: </h2>
            {predictions.map((prediction) => {
              console.log(prediction);
              const [model, predict, uses, confidence] = prediction;
              return (
                <div className="predict-shows">
                  <p className="highlight">
                    {model} {predict} {confidence.toFixed(2)}%
                  </p>
                  <p className="uses">{uses}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
