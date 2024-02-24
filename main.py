from fastapi import FastAPI, Request, Response, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
from daltonize import daltonize, simulate, convert_back, gamma_correction
from pydantic import BaseModel
import cataract
import io

app = FastAPI()
gamma = 2.4
type_ = 'd'
mode = 'Normal'

def generate_frames():
    global gamma, type_, mode
    camera = cv2.VideoCapture(0)
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            frame = cv2.flip(frame, 1)
            # cv2.imshow('video',frame)
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            if mode == 'Daltonized':
                frame = gamma_correction(frame, gamma)
                frame = daltonize(frame, type_, gamma)
                frame = convert_back(frame, gamma)
            if mode == 'Simulated':
                frame = gamma_correction(frame, gamma)
                frame = simulate(frame, type_, gamma)
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
@app.post("/gamma",tags=['gama'])
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
# Post
@app.post("/type",tags=['type'])
async def post(data: MyData):
    global type_
    text = data.json()
    type_ = text[len('{"text:" '):- len('"}')]
    print(type_)
    return {
            "status":"Success",
            "reply": "ok"
            }
@app.post("/mode",tags=['mode'])
async def post(data: MyData):
    global mode
    text = data.json()
    mode = text[len('{"text:" '):- len('"}')]
    print(mode)
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
    return Response(content, media_type='text/html')

@app.get('/cataract')
async def index(request: Request):
    content = read("cataract.html")
    return Response(content, media_type='text/html')

@app.post("/image")
async def upload_image(image: UploadFile = File(...)):
    contents = await image.read()
    result, confidence = cataract.getImg(io.BytesIO(contents))
    print(confidence)
    return {"result": result, "confidence": confidence}

