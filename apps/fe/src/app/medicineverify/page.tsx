"use client";
import { Button } from "@/components/ui/button";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import Webcam from "react-webcam";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
function page() {
  const webcamRef = useRef(null);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }, []);
  async function capture() {
    //@ts-ignore
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    if (imageSrc != null) {
      await axios.post("http://127.0.0.1:5000/verify", {
        imageSrc: imageSrc,
      });
    }
  }
  const medicines = [
    {
      med: "medicine 1",
      days: ["sunday", "monday"],
      codegen: "iwepfukbq",
    },
    {
      med: "medicine 1",
      days: ["sunday", "monday"],
      codegen: "iwepfukbq",
    },
    {
      med: "medicine 1",
      days: ["sunday", "monday"],
      codegen: "iwepfukbq",
    },
  ];
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
          Taking Medicine.
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
      <div className="w-screen justify-center mt-10">
        <Button
          onClick={() => {
            capture();
          }}
        >
          xx
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>All Medicines</CardTitle>
            <CardDescription>
              All the medicines you're prescribed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  {medicines.map((med, index) => (
                    <div className="flex gap-2" key={index}>
                      <Input value={med.med} className="h-16" />
                      <Input value={med.codegen} className="h-16" />
                      {med.days.map((day) => (
                        <div>
                          <Badge className="mt-5">{day}</Badge>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
