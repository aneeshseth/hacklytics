"use client";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useToast } from "@/components/ui/use-toast";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useRouter } from "next/navigation";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
function page() {
  const webcamRef = useRef(null);
  const [currentImagesArray, setCurrentImagesArray] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(true);
  let [loading, setLoading] = useState(true);
  const router = useRouter();
  let [color, setColor] = useState("#ffffff");
  async function trainModel() {
    //send axios request to train model
    toast({
      title: "Model has been trained, thanks!",
    });
    router.push("/form");
  }
  const { toast } = useToast();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);
  useEffect(() => {
    let timer: any;
    if (running && seconds > 0 && currentImagesArray.length < 11) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      //@ts-ignore
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc != null)
        setCurrentImagesArray([...currentImagesArray, imageSrc]);
    } else if (seconds == 0 || currentImagesArray.length == 10) {
      setRunning(false);
      trainModel();
    }
    return () => {
      clearInterval(timer);
    };
  }, [running, seconds]);
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
          Registering Face.
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
