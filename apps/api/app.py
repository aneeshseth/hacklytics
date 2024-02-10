from flask import Flask, request, jsonify
import yagmail 
import os
from supabase import create_client, Client
from apscheduler.schedulers.background import BackgroundScheduler
import redis
from flask_cors import CORS, cross_origin
from PIL import Image
from io import BytesIO
import base64 
supabase: Client = create_client("https://znheiegdydjfcpcaqdcv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuaGVpZWdkeWRqZmNwY2FxZGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNTc0ODksImV4cCI6MjAyMjgzMzQ4OX0.BIKL-7rAzjltPi6DdQVMch2AVbbDBTpW5fJIYE6KE1s")

app = Flask(__name__)
CORS(app, support_credentials=True)

sender_email = 'aneeshseth2018@gmail.com'
sender_password = 'Dogllx@2107'
subject = 'You missed the medicine.'
body = 'You missed the medicine '
import datetime
current_date = datetime.datetime.now()
current_day_of_week = current_date.strftime("%A")

redis_client = None

def initRedis():
    global redis_client
    redis_uri = 'rediss://default:AVNS_KOMZiQj61yP1Yb6T-iJ@redis-205ef966-sjsu-f7b6.a.aivencloud.com:11920'
    redis_client = redis.from_url(redis_uri)

    redis_client.set('key', 'hello world')
    key = redis_client.get('key').decode('utf-8')

    print('The value of key is:', key)

def my_job():
    data = supabase.table('meds').select('*').gt('stocktoday', 0).execute()
    for i in data[1]:
        send_email(sender_email, sender_password, i.userid, subject, body + i.med + "!")
    data2 = supabase.table('meds').select('*').execute()
    for j in data2[1]:
        if (current_day_of_week.lower() in j.days):
            data, count = supabase.table('meds').update('stocktoday', 1).eq('id', j.id).execute()


def schedule_job():
    scheduler = BackgroundScheduler()
    scheduler.add_job(my_job, 'cron', hour=0)  
    scheduler.start()

def send_email(sender_email, sender_password, receiver_email, subject, body):
   """
   yag = yagmail.SMTP(sender_email, sender_password)
   yag.send(
        to=receiver_email,
        subject=subject,
        contents=body
    )
    """

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    supabase.table('users').insert({"email": data.get('useremail')}).execute()
    supabase.table('meds').insert({"useremail": data.get('useremail'), "med": data.get("med"), "days": data.get("days"), "codegen": data.get("codegen"), "stocktoday": data.get("stocktoday")}).execute()
    return jsonify({"message": "User added successfully"}), 200
       
@app.route('/get_prescribed', methods=['POST'])
def get_prescribed():
    data = request.json
    response = supabase.table("meds").select("*").execute().eq("useremail", data.get("email"))
    print(response)
    return jsonify({"message": response}), 200

def convert_base64_to_jpeg(base64_string, output_path):
    image_data = base64.b64decode(base64_string.split(",")[1])
    with open(output_path, "wb") as f:
        f.write(image_data)

@app.route('/verify', methods=['POST'])
def verify_image():
    data = request.json
    convert_base64_to_jpeg(data.get("imageSrc"), "output.jpg")
    return jsonify({"message": "User clicked successfully"}), 200

if __name__ == '__main__':
    schedule_job()
    initRedis()
    app.run(debug=True)


