import pandas as pd
from pymongo import MongoClient, UpdateOne
import os
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
MONGO_URI = os.getenv("MONGO_URI") # e.g., mongodb://localhost:27017
DB_NAME = os.getenv("DB_NAME") # Change to your actual DB name
COLLECTION_NAME = os.getenv("COLLECTION_NAME") # Mongoose usually pluralizes 'Event' to 'events'
FILE_PATH = "events.xlsx"

def parse_and_upload_events(file_path):
    print("Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    print("Reading Excel file...")
    df = pd.read_excel(file_path)

    events_to_upsert = []
    current_event = None

    for index, row in df.iterrows():
        # Detect New Event
        if pd.notna(row["Event Name"]):
            if current_event:
                events_to_upsert.append(current_event)

            members_per_team = int(row["Members per team (in number)"])
            fees = float(row.get("Fees", 0))

            # Rules logic
            rules_list = []
            if pd.notna(row["Rules"]):
                rules_list = [r.strip() for r in str(row["Rules"]).split("\n") if r.strip()]

            # Clubs logic
            clubs_list = []
            if pd.notna(row["Club"]):
                clubs_list = [c.strip() for c in str(row["Club"]).split(",")]

            # Create document matching your Schema
            current_event = {
                "eventName": str(row["Event Name"]).strip(),
                "category": str(row["Category"]).strip(),
                "date": str(row["Date (DD/MM/YY)"]),
                "time": str(row["Time (hh:mm)"]),
                "duration": str(row["Duration"]),
                "venue": str(row["Venue"]),
                "description": str(row["Description"]).strip(),
                "banner": "",
                "rules": rules_list,
                "clubs": clubs_list,
                "isTeamEvent": members_per_team > 1,
                "membersPerTeam": members_per_team,
                "isPaidEvent": fees > 0,
                "fees": fees,
                "pocs": [],
                "registrations": [] # Initialized empty to match schema
            }

        # Add POCs to current event
        if current_event and pd.notna(row["POC name"]):
            current_event["pocs"].append({
                "name": str(row["POC name"]).strip(),
                "mobile": str(row["POC mobile"])
            })

    # Add the last event from the loop
    if current_event:
        events_to_upsert.append(current_event)

    # --- Database Operation ---
    if events_to_upsert:
        print(f"Preparing to upload {len(events_to_upsert)} events...")
        
        operations = []
        for event in events_to_upsert:
            # We use eventName as the unique filter to prevent duplicates
            operations.append(
                UpdateOne(
                    {"eventName": event["eventName"]}, 
                    {"$set": event}, 
                    upsert=True
                )
            )

        result = collection.bulk_write(operations)
        print(f"Successfully processed events!")
        print(f"- Inserted: {result.upserted_count}")
        print(f"- Updated: {result.modified_count}")
    else:
        print("No events found to upload.")

    client.close()

if __name__ == "__main__":
    if os.path.exists(FILE_PATH):
        parse_and_upload_events(FILE_PATH)
    else:
        print(f"Error: {FILE_PATH} not found.")