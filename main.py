from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
import cv2
from daltonize import daltonize, simulate, convert_back
from pydantic import BaseModel

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
            #print(gamma)
            frame = daltonize(frame, 'd', gamma)
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

def read():
    with open("index.html", 'r') as f:
        content = f.read()
    content += "<style>"
    with open("style.css", 'r') as f:
        content += f.read()
    content += "</style>"
    return content


# # Route to stream webcam feed
@app.get('/video_feed')
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')

class MyData(BaseModel):
    text: str
    
# Post
@app.post("/gamma",tags=['reply'])
async def post(data: MyData):
    global gamma
    text = data.json()
    text = int(text[len('{"text:" '):- len('"}')])
    print("Text:", text)
    gamma = text/100
    return {
            "status":"Success",
            "reply": "hihi"
            }
    
    
# # Route to serve HTML page
@app.get('/')
async def index(request: Request):
    content = read()
    return Response(content, media_type='text/html')

