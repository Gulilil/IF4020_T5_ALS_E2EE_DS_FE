import { useEffect, useRef, useState } from "react";
import { ec as EC } from "elliptic";
import "./App.css";
import { Socket, io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    socketRef.current = newSocket;
    const ec = new EC("secp256k1");
    const key = ec.genKeyPair();
    const clientPublicKey = key.getPublic();

    newSocket.on("connect", () => {
      console.log("Connected to server");

      newSocket.emit("clientPublicKey", clientPublicKey.encode("hex", false));
    });
    newSocket.on("publicKey", (serverPublicKey) => {
      console.log("Receive server public key");
      const sharedSecret = key.derive(
        ec.keyFromPublic(serverPublicKey, "hex").getPublic()
      );
      console.log("Shared secret:", sharedSecret);
    });
    // return () => newSocket.close();
  }, []);
  const hanldeSubmit = () => {
    console.log("Submitted with message", message);
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", message);
    }
  };
  return (
    <>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={hanldeSubmit}>Send</button>
    </>
  );
}

export default App;
