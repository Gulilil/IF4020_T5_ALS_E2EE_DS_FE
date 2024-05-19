import { ec as EC } from "elliptic";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

const TestingSocket = () => {
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    const ec = new EC("secp256k1");
    const key = ec.genKeyPair();
    const clientPublicKey = key.getPublic();
    newSocket.on("connect", () => {
      console.log("Connected to server");

      newSocket.emit("clientPublicKey", clientPublicKey.encode("hex", false));
    });
    newSocket.on("publicKey", (serverPublicKey) => {
      console.log("Receive server public key");
      const serverKey = ec.keyFromPublic(serverPublicKey, "hex");
      const sharedSecret = key.derive(serverKey.getPublic()).toString(16);

      console.log("Shared secret:", sharedSecret);
    });
  }, []);
  return <div>Testing Socket</div>;
};

export default TestingSocket;
