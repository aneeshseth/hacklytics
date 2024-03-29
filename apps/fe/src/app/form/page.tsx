"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Webcam from "react-webcam";
import { useRef, useState } from "react";
import { FancyMultiSelect } from "@/components/ui/multi-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  codegenSelector,
  codegenState,
  daysSelector,
  daysState,
} from "@/store/state";

export default function CardWithForm() {
  const [medNumber, setMedNumber] = useState<
    { medName: string; verified: boolean; maxCount: string; medCode: string }[]
  >([]);
  const [username, setUsername] = useState("");
  const selectedDays = useRecoilValue(daysSelector);
  const [checkingCameraState, setCheckingCameraState] =
    useState<boolean>(false);
  const webcamRef = useRef(null);
  const router = useRouter();
  const codeGenVal = useRecoilValue(codegenSelector);
  const [codeGen, setCodeGen] = useState(codegenState);
  const [selectedValues, setSelectedValues] = useRecoilState(daysState);
  async function addMedicine(index: number, e: any) {
    e.preventDefault();
    console.log(username);
    console.log(selectedDays);
    console.log(medNumber[index].medCode);
    console.log(medNumber[index].medName);
    /*
    await axios.post("http://127.0.0.1:5000/add_user", {
      useremail: username,
      days: selectedDays,
      codegen: medNumber[index].medCode,
      med: medNumber[index].medName,
      stocktoday: 0,
    });
    */
  }
  function changeMedNumber() {
    const findInvalidMed = medNumber.find((med) => !med.verified);
    if (findInvalidMed == undefined || medNumber.length === 0) {
      setSelectedValues([]);
      setMedNumber([
        ...medNumber,
        { medName: "", verified: false, maxCount: "", medCode: "" },
      ]);
      return;
    }
    alert("please check availability of the ones you havent checked for.");
  }

  const handleMedNameChange = (index: number, value: string) => {
    const updatedMeds = [...medNumber];
    updatedMeds[index].medName = value;
    setMedNumber(updatedMeds);
  };

  const handleMedCodeChange = (index: number, value: string) => {
    const updatedMeds = [...medNumber];
    updatedMeds[index].medCode = value;
    setMedNumber(updatedMeds);
  };

  async function addMedicines() {
    if (username == "") return;
    const findNonVerified = medNumber.find((med) => med.verified == false);
    if (findNonVerified == undefined) return;
    //send axios request to add to db
    await axios.post("http://127.0.0.1:5000/add_user", {
      email: username,
      med: medNumber,
    });
  }

  return (
    <>
      {!checkingCameraState && (
        <div>
          <div className={`flex justify-center w-screen h-screen items-center`}>
            <Card className="w-[850px] -mt-28">
              <CardHeader>
                <CardTitle>Add Medicines</CardTitle>
                <CardDescription>
                  Add all the medicines you need.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <div className="flex flex-col space-y-1.5 mb-5">
                        <Label htmlFor="name" className="mb-2">
                          email-ID
                        </Label>
                        <Input
                          id="name"
                          placeholder="add your email for missed medicine notifications."
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                        />
                      </div>
                      {medNumber.map((med, index) => (
                        <div className="flex gap-2" key={index}>
                          <Input
                            value={med.medName}
                            placeholder="Med Name"
                            onChange={(e) =>
                              handleMedNameChange(index, e.target.value)
                            }
                            className="h-16"
                          />
                          <Input
                            value={med.medCode}
                            placeholder="Med code"
                            onChange={(e) =>
                              handleMedCodeChange(index, e.target.value)
                            }
                            className="h-16"
                          />
                          <FancyMultiSelect />
                          <Button
                            onClick={() => {
                              setCheckingCameraState((prevState) => !prevState);
                            }}
                            className="mt-2"
                          >
                            Med Availability
                          </Button>
                          <Button
                            onClick={(e) => {
                              addMedicine(index, e);
                            }}
                            className="mt-2"
                          >
                            Add Medicine
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={changeMedNumber}>
                  +
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/registerface");
                  }}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      {checkingCameraState && (
        <>
          <div className={`ml-3 mt-12 flex w-screen justify-center`}>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Show the medicine on the screen.
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
        </>
      )}
    </>
  );
}
