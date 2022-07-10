from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


from service import do_style_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StylingMessageIn(BaseModel):
    image: List[int]
    style: List[int]


class StylingMessageOut(BaseModel):
    result: List[int]


@app.post("/api/v1/style", response_model=StylingMessageOut)
def create_user(message: StylingMessageIn):
    imgArr = bytearray(message.image)
    styleArr = bytearray(message.style)

    result = do_style_image(imgArr, styleArr)
    result = list(result)

    response = StylingMessageOut(result=result)
    return response
