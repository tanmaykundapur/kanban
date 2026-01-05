from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

# Create an Instance of FastAPI
app = FastAPI()

# Disable CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to DB
conn = psycopg2.connect("dbname=kanban user=tanmayk")

# Print DB
def printDB():
    cur = conn.cursor()
    tables = ['users', 'kanbans', 'access', 'columns', 'tasks']

    for table in tables:
        print("================= " + table.upper() + " ===================")
        cur.execute('SELECT * from ' + table)
        for record in cur:
            print(record)

printDB()
print("Executed")



# Home Page
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Read Kanbans
@app.get("/kanbans")
async def readKanbans():
    print("Reading Kanbans...")
    cur = conn.cursor()
    cur.execute('SELECT * from kanbans')
    out = {}
    for i, record in enumerate(cur):
        out[str(i)] = record
    cur.close()
    return out


# Read Columns
# Read Tasks

# Create Kanban
# Create Column
# Create Task
# Update Task
# Delete Task

#

def read():
    print("Read")

def update():
    print("Updated")

def delete():
    print("Deleted")

# Disconnect from DB
# conn.close()