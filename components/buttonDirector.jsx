import { Spacer, Input, Link, Button } from "@nextui-org/react";
import {Tooltip} from "@nextui-org/react";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { useState } from "react";

function NextQuestion(props){

}

function NextPage(props){

}

export default function ButtonDirector(props){
    const [cnt, setCnt] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isNextPage, setIsNextPage] = useState(false);
    
    let content = null;
    if(!isNextPage){
        content = <Tooltip content="next question!" color="primary">
        <Button 
        className="w-[40px] h-[40px]"
        color="primary"
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
            setIsNextPage(true);
          }
        }}
        
        >
          <IoMdArrowDroprightCircle size={40}/>
        </Button>
      </Tooltip>
    }
    else{
        content=<Button as={Link} href={linkInfo} isDisabled={isDisabled}
        color="primary" 
        >
            Next Step!
        </Button>
    }

    return(
        <div>
            {content}
        </div>
    );
}