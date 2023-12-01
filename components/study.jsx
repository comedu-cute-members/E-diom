"use client";
import { Spacer, Input } from "@nextui-org/react";
import { FaMicrophone } from "react-icons/fa";
import { useState } from "react";
import AudioRecord from "../components/audioRecord"

function Test(){
  const [question, setQuestion] = useState("");
  // 임의로 지정함
  const [text, setText] = useState("I'm so tired. What should I do?");
  const [value, setValue] = useState("");

  return (
    <>
      <div className="flex align-center justify-center">
        <h1 className="text-3xl test-slate-500 hover:text-blue-600">{text}</h1>
      </div>
      
      <Spacer y={50}/>

      <div className="flex flex-row justify-center items-center">
        <AudioRecord/>
        <Spacer x={1} />
        <Input
        isReadOnly
        placeholder="Answer!"
        value={value}
        onValueChange={setValue}
        className="w-[400px]"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-background/70",
            "backdrop-saturate-150",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "hover:bg-background/30",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        >
        <p className="text-default-500 text-small">Input value: {value}</p>
        </Input>
      </div>
      <div>
        <p>{value}</p>
      </div>
    </>
  );
}


export default function Study() {
  return (

    <div className="h-full">
      <Spacer y={170} />
      <Test/>
    </div>
  )
}
