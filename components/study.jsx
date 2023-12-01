"use client";
import { Spacer, Input, Link, Button } from "@nextui-org/react";
import { useState } from "react";
import AudioRecord from "../components/audioRecord"
import { IoMdArrowDroprightCircle } from "react-icons/io";
import {Tooltip} from "@nextui-org/react";
import { useTypewriter } from 'react-simple-typewriter'



function Test(props){
  // input 페이지에서 학습할 단어 입력하고 페이지 넘기면 이곳으로 질문 3개가 넘어옴
  const [question, setQuestion] = useState("I'm so tired. What should I do?");
  // 임의로 지정함
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState("Answer~");
  const [cnt, setCnt] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [test, setTest] = useState(1);

  const clickHandler = ({ item }) =>{
    //navigate('/search', {state: {item},});

    setIsLoading(true);

    setTimeout(()=>{
      setIsLoading(false);
    }, 30000);
  };

  var linkInfo;
  if(props.maxTest == 5){
    linkInfo = "/input"
  }
  else{
    linkInfo = "/dashboard"
  }

  let content = null;
  if(isDisabled){
    content = <Tooltip content="next question!" color="primary">
    <Button 
    as={Link} href={linkInfo}
    className="w-[40px] h-[50px]"
    color="transparent"
    variant="flat"
    onClick={e => {
      e.preventDefault();
      if(cnt == 0){
        setCnt(1);
        setFeedback("I'm so tired. What should I do?");
      } 
      else if(cnt == 1){
        if(test < props.maxTest){
          setTest(test + 1);
          console.log(test);
          setFeedback("");
        }
        setCnt(0);
      }
      if(test >= props.maxTest){
        console.log(test);
        setIsDisabled(false);
      }
    }}
    >
      <IoMdArrowDroprightCircle size={40}/>
    </Button>
  </Tooltip>
  }
  else{
    content = <Button as={Link} href={linkInfo} isDisabled={isDisabled}
    color="transparent" className="w-[40px] h-[50px]"
    >
        Next!
    </Button>
  }
  
//"It is Over! You can't stop me lovin ma self! It is Over! You can't stop me lovin ma self!"
  
  return (
    <>
      {/* <h1>
        i am
        <span>{text}</span>
      </h1> */}
      <Spacer y={100} />
      <div className="flex align-center justify-center">
        <h1 className="text-3xl test-slate-500 hover:text-blue-600">{question}</h1>
      </div>

      <Spacer y={50}/>

      <div className="flex text-center align-center justify-center items-center">
        <div className="grid place-items-center text-lg w-[400px] h-[180px] border-4">
          {feedback}
        </div>
      </div>

      <Spacer y={70}/>
      <div className="flex flex-row justify-center items-center">
        <Spacer x={12} />
        <AudioRecord/>
        <Spacer x={3} />
        <Input
        isReadOnly
        placeholder="Answer!"
        answer={answer}
        onAnswerChange={setAnswer}
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
        <p className="text-default-500 text-small">Input answer: {answer}</p>
        </Input>
        <Spacer x={-3} />
        {content}        
      </div>

    </>
  );
}


export default function Study(props) {
  console.log(props.maxTest);
  return (
    <div className="h-full">
      <Test maxTest={props.maxTest}/>
    </div>
  )
}
