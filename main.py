from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
from daltonize import daltonize, simulate, convert_back
from pydantic import BaseModel
import base64

app = FastAPI()
gamma = 2.4

def generate_frames():
    global gamma
    camera = cv2.VideoCapture(0)
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            frame = cv2.flip(frame, 1)
            cv2.imshow('video',frame)
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = simulate(frame, 'd', gamma)
            frame = convert_back(frame, gamma)
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                camera.release()
                cv2.destroyAllWindows()
                break
            ret, buffer = cv2.imencode('.png', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
generate_frames()

def read(file):
    with open(file, 'r') as f:
        content = f.read()
    content += "<style>"
    with open("style.css", 'r') as f:
        content += f.read()
    content += "</style>"
    return content

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route to stream webcam feed
@app.get('/video_feed')
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')

@app.get('/bg')
async def video_feed():
    with open('./assets/bg.png', 'rb') as image_file:
        image_data = image_file.read()
    return Response(content=image_data, media_type='image/jpeg')

class MyData(BaseModel):
    text: str
    
# Post
@app.post("/gamma",tags=['reply'])
async def post(data: MyData):
    global gamma
    text = data.json()
    text = int(text[len('{"text:" '):- len('"}')])
    gamma = text/100
    print(gamma)
    return {
            "status":"Success",
            "reply": "ok"
            }
    
    
# # Route to serve HTML page
@app.get('/')
async def index(request: Request):
    content = read("index.html")
    return Response(content, media_type='text/html')

# # Route to serve HTML page
@app.get('/home')
async def index(request: Request):
    content = read("home.html")
    with open("./assets/bg.png", "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode("utf-8")
    content = content.replace("{IMAGE_SRC}", f"data:image/jpeg;base64,{encoded_image}")
    return Response(content, media_type='text/html')

