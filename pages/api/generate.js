const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
  return `data:image/png;base64,${base64}`;
};

const generateAction = async (req, res) => {
  console.log("Received request");

  const data = { inputs: JSON.parse(req.body).input };
  // Add fetch request to Hugging Face
  const response = await fetch(
    "https://api-inference.huggingface.co/models/thibgn/thomgamb1-5",
    {
      headers: { Authorization: `Bearer ${process.env.HF_AUTH_KEY}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    // Convert to base64
    const base64 = bufferToBase64(buffer);
    // Make sure to change to base64
    res.status(200).json({ image: base64 });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;
