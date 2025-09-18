import time
import requests
import os

LOG_FILE = r"C:\nginx-1.28.0\logs\access.log"   # same file written by app.py
RECEIVER_URL = "http://127.0.0.1:8000/receive-logs"  # machine B endpoint

def send_new_logs():
    last_position = 0


    while True:
        try:
            if os.path.exists(LOG_FILE):
                with open(LOG_FILE, "r") as f:
                    f.seek(last_position)   # jump to last read position
                    new_logs = f.read()
                    last_position = f.tell()

                if new_logs.strip():
                    response = requests.post(RECEIVER_URL, data=new_logs.encode("utf-8"))
                    print(f"📤 Sent new logs ({len(new_logs.splitlines())} lines), Response: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Error: {e}")

        time.sleep(30)

if __name__ == "__main__":
    send_new_logs()
