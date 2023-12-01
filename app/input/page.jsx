"use client";

import { Button, Input } from "@nextui-org/react";
import Navigation from "@/components/navigation";
import { motion } from "framer-motion";
import { testScore, expressionState, questionState } from "@/components/recoil";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";

const axios = require("axios").default;

async function sendExpressionGetQuestion(value, score, changeWindow) {
  var level;
  if (score == 30) level = 5;
  else level = Math.floor(score / 6) + 1;
  await axios
    .post("http://localhost:8000/question_generation", {
      expression: value,
      level: level,
    })
    .then((response) => {
      changeWindow(response.data);
    });
}

export default function InputView() {
  const [value, setValue] = useState("");
  const [score] = useRecoilState(testScore);
  const [expression, setExpression] = useRecoilState(expressionState);
  const [question, setQuestion] = useRecoilState(questionState);

  const router = useRouter();

  function changeWindow(data) {
    setExpression(value);
    setQuestion(data);
    router.push("/conversation");
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-cyan-500 to-blue-300">
      <Navigation />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 2,
        }}
      >
        <div className="flex flex-col h-[calc(100vh-65px)] w-fit-content items-center justify-center">
          <div className="text-center text-2xl">
            {"자, 이제 학습을 시작해 볼까요?"}
          </div>
          <div className="text-center mb-10 text-2xl">
            {"학습할 표현을 입력해 주세요."}
          </div>
          <Input
            className="w-56 m-4"
            value={value}
            onValueChange={setValue}
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
            placeholder="입력하세요"
          />
          <Button
            className="w-56 mx-4 bg-background/70 backdrop-saturate-150"
            onClick={() => {
              sendExpressionGetQuestion(value, score, changeWindow);
            }}
          >
            학습 시작
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
