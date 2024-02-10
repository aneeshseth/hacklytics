"use client";
import { toast } from "@/components/ui/use-toast";
import React, { useEffect, useRef, useState, CSSProperties } from "react";
import Webcam from "react-webcam";
import PacmanLoader from "react-spinners/PacmanLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
function page() {
  const webcamRef = useRef(null);
  const [seconds, setSeconds] = useState(15);
  const [running, setRunning] = useState(true);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  async function checkTrainingModel() {
    //send request to training model, make sure to check if image not null then send req
    //@ts-ignore
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    if (true) setRunning(false);
  }
  useEffect(() => {
    let timer: any;
    if (running && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      checkTrainingModel();
    }
    if (seconds === 0) {
      setRunning(false);
      toast({
        title: "Model couldn't find your face registered, please try again!",
      });
    }
    if (!running) {
      toast({
        title: "Model has detected your face!",
      });
    }
    return () => {
      clearInterval(timer);
    };
  }, [running, seconds]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center w-screen h-screen items-center">
        <PacmanLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }
  return (
    <div>
      <div className="ml-3 mt-12 flex w-screen justify-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Searching Face ID
        </h1>
      </div>
      <div className="justify-center flex mt-10">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

export default page;
