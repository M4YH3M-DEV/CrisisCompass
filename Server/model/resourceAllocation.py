import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


def get_departments_from_db():
    MONGODB_URI = os.getenv("MONGODB_URI")
    client = MongoClient(MONGODB_URI)
    db = client["CrisisCompass"]
    collection = db["Departments"]

    cursor = collection.find(
        {},
        {
            "name": 1,
            "foodHave": 1,
            "waterHave": 1,
            "medicalHave": 1,
            "shelterHave": 1,
            "blanketsHave": 1,
            "rescuePersonnelHave": 1,
            "_id": 0,
        },
    )

    departments_data = list(cursor)
    client.close()

    return {dept["name"]: dept for dept in departments_data}


def allocate_resources(resource_data):

    departments = get_departments_from_db()

    total_resources = {
        "food": sum(dept["foodHave"] for dept in departments.values()),
        "water": sum(dept["waterHave"] for dept in departments.values()),
        "medical": sum(dept["medicalHave"] for dept in departments.values()),
        "shelter": sum(dept["shelterHave"] for dept in departments.values()),
        "blankets": sum(dept["blanketsHave"] for dept in departments.values()),
        "rescuePersonnel": sum(
            dept["rescuePersonnelHave"] for dept in departments.values()
        ),
    }

    gaps = {
        "food": max(0, resource_data["foodRequired"] - resource_data["foodHave"]),
        "water": max(0, resource_data["waterRequired"] - resource_data["waterHave"]),
        "medical": max(
            0, resource_data["medicalRequired"] - resource_data["medicalHave"]
        ),
        "shelter": max(
            0, resource_data["shelterRequired"] - resource_data["shelterHave"]
        ),
        "blankets": max(
            0, resource_data["blanketsRequired"] - resource_data["blanketsHave"]
        ),
        "rescuePersonnel": max(
            0,
            resource_data["rescuePersonnelRequired"]
            - resource_data["rescuePersonnelHave"],
        ),
    }

    allocation = {dept: {} for dept in departments}
    allocation_summary = {
        "total_gaps": gaps,
        "can_fulfill": {},
        "departments_allocation": {},
        "units": {
            "food": "kg",
            "water": "liters",
            "medical": "units",
            "shelter": "units",
            "blankets": "units",
            "rescuePersonnel": "count",
        },
    }

    for resource in gaps:
        gap = gaps[resource]
        allocation_summary["can_fulfill"][resource] = gap <= total_resources[resource]

        if gap == 0:
            for dept in departments:
                allocation[dept][resource] = 0
            continue

        total_available = total_resources[resource]
        if total_available == 0:
            for dept in departments:
                allocation[dept][resource] = 0
            continue

        for dept in departments:
            dept_have = departments[dept][resource + "Have"]
            if total_available > 0:
                dept_allocation = min(dept_have, (dept_have / total_available) * gap)
                if resource in ["food", "water"]:
                    allocation[dept][resource] = round(dept_allocation, 1)
                else:
                    allocation[dept][resource] = round(dept_allocation)
            else:
                allocation[dept][resource] = 0

    allocation_summary["departments_allocation"] = allocation

    return allocation_summary

#MAYHEM-DEV
