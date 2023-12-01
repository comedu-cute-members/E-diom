from bardapi import Bard
import re
from google.cloud import speech
from google.cloud import storage
from fastapi import FastAPI, UploadFile, Request, HTTPException
import os
import librosa
import soundfile
from moviepy.editor import VideoFileClip
from pydub import AudioSegment 
import csv
import shutil
from fastapi.responses import JSONResponse
import pandas as pd
from collections import Counter
from datetime import datetime
from pydub import AudioSegment

token = "dwjnCrLckuzrNoHp-V1Cq1OJYoS970D0VsesgHtJ-sMDMIhcRPC-QsIbKfyjUerK2b6qNg."
bard = Bard(token=token)

# 구글 서비스 계정 인증을 위한 환경변수 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "word_fisher_credentials.json"

# 구글 클라우드 스토리지 내 버킷 이름 설정
bucket_name = "word_fisher"

# FastAPI 애플리케이션 객체 생성
app = FastAPI()

# 사용자가 업로드한 오디오 파일 저장
def save_uploaded_file(file: UploadFile, destination: str):
    try:
        with open(destination, "wb") as f:
            f.write(file.file.read())
        
        audio_time_series, sampleing_rate = librosa.core.load(destination, sr=None)
        soundfile.write(destination, audio_time_series, sampleing_rate)
            
    except Exception as e:
        return {"Error in save_uploaded_file": str(e)}    
    
# 구글 클라우드에 파일 업로드
def upload_to_bucket(audio_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)

    # 오디오 파일 업로드
    blob = bucket.blob(f"{audio_name}")
    blob.upload_from_filename(audio_name)

# Speech to text 후 script.txt(전체 대본)와 data.csv(단어별 시작시간, 끝시간) 생성
def recognize_speech(file_path: str) -> speech.RecognizeResponse:
    print("re")
    
    f = open("script.txt","w+")

    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=f"gs://word_fisher/{file_path}")
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=AudioSegment.from_wav(file_path).frame_rate,  
        language_code="en-US",
        enable_word_time_offsets=True,
    )

    operation = client.long_running_recognize(config=config, audio=audio)
    result = operation.result()

    for result in result.results:
        alternative = result.alternatives[0]
        f.write(f"{alternative.transcript} ")

    text = f.readline()
    f.close()

    return text

def extract_question(input_string):
    questions = []

    for _ in range(3):
        for i in range(len(input_string) - 1):
            if (input_string[i] == ':' or input_string[i] == '.') and input_string[i-1].isdigit():
                break  

        input_string = input_string[i+1:]

        start_index = None
        end_index = None

        for i, char in enumerate(input_string):
            if char.encode().isalpha() and start_index is None:
                start_index = i
            elif char == '?' and end_index is None:
                end_index = i
                break

        if start_index is not None and end_index is not None:
            result_substring = input_string[start_index:end_index+1]
            questions.append(result_substring)
        else:
            return None

    return questions
    
def extract_score(input_string):
    scores = []

    for j in range(3):
        for i in range(len(input_string) - 1):
            if input_string[i] == ':':
                if input_string[i+2].isdigit(): 
                    if input_string[i+3].isdigit():
                        scores.append(int(input_string[i+2:i+4]))
                    else:
                        scores.append(input_string[i+2])
                    break  

        input_string = input_string[i+1:]

    return scores

def extract_score_for_test(answer):
    numbers = [int(each) for each in re.findall(r'\d+', answer)]

    if not numbers:
        return {"error": "숫자를 찾을 수 없습니다."}

    return numbers[:4]

def brute_check(user_answer, keyword):
  user_answer_split = user_answer.split()
  keyword_split = keyword.split()
  length = len(keyword_split)

  if length == 1:
    for i in range(len(user_answer_split)):
      if user_answer_split[i] == keyword_split[0]:
        return 4

    return 0

  else: # length == 2
    for i in range(len(user_answer_split)):
      if (user_answer_split[i] == keyword_split[0]) and (user_answer_split[i+1] == keyword_split[1]):
        return 4

    return 0  

@app.post("/test")
def test(file: UploadFile, request: Request):
    try:
        index = 0
        score = 0

        question_list = ['You are going to a job interview. What do you think is the most important thing to do?' , 'How do you think about living as a leopard?' , 'How did your parents play with you when you were six years old?' , 'Who is your favorite sports star, and what is his talent?' , 'Have you ever solved some questions even though you do not know the exact solving method?']
        keyword_list = ['should' , 'prefer', 'used to' , 'good at', 'somehow']

        audio_file = file.filename
        save_uploaded_file(file, audio_file)
        upload_to_bucket(audio_file)
        text = recognize_speech(audio_file)

        sentence = f"‘{question_list[index]}’ 라는 질문에 대해 '{text}' 라는 응답을 다음과 같은 기준으로 0점에서 6점으로 평가해줘. 1)‘응답자의 의견이 반영되어있는가?’ (2점) , 2)‘문장에 문법적인 오류가 없는가? (1점) , 3)‘질문의 주제에 벗어나지 않는 올바른 응답인가?’ (3점). 이때, 출력 결과의 형식은 '항목: 점수'로 해줘"

        answer = bard.get_answer(sentence)['content']

        score_list = extract_score_for_test(answer)

        max_v = max(score_list)

        check = brute_check(text, keyword_list[index])
        score = max_v + check

        return JSONResponse(content={"총점": score})
    
    except Exception as e:
        return {"Error in test": str(e)} 

@app.post("/question_generation")
def question_generation(request: Request):
    f = open("questions.csv", "w+", newline='')
    csv_writer = csv.writer(f)
    expression = "should"
    questions = []
    
    question_for_Q = f"내가 {expression}라는 표현을 사용해서 대답할 수 있는 영어 질문을 해당 질문이 응답자의 생각을 요구하는 것에 따라 5개의 난이도로 나누어서, 난이도 1에 해당하는 질문을 3개 해줘. 이때, 하나의 질문을 출력할 때의 형식은 '질문 번호: 질문' 으로 해줘"
    answer = bard.get_answer(question_for_Q)['content']
    # answer = "질문 1: Should you learn a new language if you are planning to travel to a foreign country? 질문 2: Should you save money for the future or spend it on experiences? 질문 3: Should you follow your dreams or be practical? 이 질문들은 모두 응답자의 생각을 요구하는 질문으로, 난이도 3에 해당합니다."

    questions = extract_question(answer)
    print(print(answer))
    print(questions)
    
    csv_writer.writerow(questions)

    f.close()
    
    return JSONResponse(content = {"question1": questions[0],
                                   "question2": questions[1],
                                   "question3": questions[2]})

@app.post("/main_question")
def main_question(file: UploadFile, request: Request):
    try:
        audio_file = file.filename
        save_uploaded_file(file, audio_file)
        upload_to_bucket(audio_file)
        text = recognize_speech(audio_file)

        f = open("questions.csv", "r")
        questions = list(csv.reader(f))[0]
        f.close()

        expression = "should"
        index = 0

        input = f"‘{questions[0]}’ 라는 질문에 대한 '{text}' 라는 응답을 다음과 같은 기준으로 0점에서 10점으로 평가해줘. 1)‘문장에 문법적인 오류가 없는가? (10점), 2)‘질문의 주제에 벗어나지 않는 올바른 응답인가?’ (10점). 이때, 출력 결과의 형식은 '기준 항목의 번호: 점수'와 '총점: 점수 합계'로 해줘. 이때, 총점은 마지막에 출력해줘"

        answer = bard.get_answer(input)['content']
        print(answer)
        scores = extract_score(answer)
        print(scores)

        return JSONResponse(content= {
        "표현": expression,
        "문법적인 오류": scores[0],
        "질문의 주제 적합성": scores[1],  
        "총점": scores[2]                   
                              })
    except Exception as e:
        return {"Error in main_question": str(e)}    