import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

const Home = () => {
  const [input, setInput] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [img, setImg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const maxRetries = 50;
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
    window.alert = function () {
      debugger;
    };
  });

  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const generateAction = async () => {
    // Add this check to make sure there is no double click
    if (isGenerating && retry === 0) return;
    setIsGenerating(true);

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });
      setRetry(0);
    }

    // create fetch resquest on our api endpoint
    const response = await fetch("api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    // If model still loading, drop that retry time
    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }

    setImg(data.image);
    setLastPrompt(input);
    setInput("");
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>tibn4 Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>tibn4 generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Create your favorite version of titi.</h2>
            <h2>
              Make sure to include{" "}
              <span className="prompt-keyword">thomgamb</span> in the prompt to
              create me in your image.
            </h2>
          </div>
          <div className="prompt-container">
            <input
              type="text"
              className="prompt-box"
              value={input}
              onChange={onChange}
            />
            <div className="prompt-buttons">
              <a
                className={
                  isGenerating ? "generate-button loading" : "generate-button"
                }
                onClick={generateAction}
              >
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
            {img && (
              <div className="output-content">
                <Image src={img} width={512} height={512} alt={input} />
                <p>{lastPrompt}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
