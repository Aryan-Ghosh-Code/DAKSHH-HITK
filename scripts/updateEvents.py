from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# -------------------------------
# MongoDB Connection
# -------------------------------
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

MAX_SAFE_INTEGER = 9007199254740991

events = [
    {"eventName": "Brainstorm", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "TechTussle", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "HydroLaunch", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Robo Dangal", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Robo War", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Robo Race", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Robo Soccer", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Solve the Maze", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Circuitrix", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "VALORANT", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "BGMI", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Hack Among Us", "teamLimit": 60},
    {"eventName": "Model Forge", "teamLimit": 20},
    {"eventName": "Skeld Sprint", "teamLimit": 60},
    {"eventName": "Modelworks (Solidworks)", "teamLimit": 60},
    {"eventName": "Quiz Tank", "teamLimit": 60},
    {"eventName": "Startup Expo", "teamLimit": 80},
    {"eventName": "Loadrix", "teamLimit": 35},
    {"eventName": "CADventure", "teamLimit": 50},
    {"eventName": "novaTechX", "teamLimit": 30},
    {"eventName": "Sci-Charades", "teamLimit": MAX_SAFE_INTEGER},
    {"eventName": "Vibe-A-Thon", "teamLimit": 80},
    {"eventName": "Mélange", "teamLimit": 60},
    {"eventName": "AI Protosprint", "teamLimit": 60},
    {"eventName": "Capture The Flag", "teamLimit": MAX_SAFE_INTEGER},
]

# -------------------------------
# Update Existing Documents Only
# -------------------------------
for event in events:
    result = collection.update_one(
        {"eventName": event["eventName"]},  # find condition
        {"$set": {"teamLimit": event["teamLimit"]}}  # update
    )

    if result.matched_count > 0:
        print(f"Updated: {event['eventName']}")
    else:
        print(f"Not Found: {event['eventName']}")

client.close()