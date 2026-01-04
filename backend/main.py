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
conn = psycopg2.connect("dbname=mydb user=tanmayk")

cur = conn.cursor()

# Initial Seeding of DB
# with open("./db/schema/seedDB.sql", 'r') as f:
#     sql_script = f.read()
# cur.execute(sql_script)
# conn.commit()

# Print DB
def printDB():
    tables = ['users', 'kanbans', 'access', 'columns', 'tasks']

    for table in tables:
        print("================= " + table.upper() + " ===================")
        cur.execute('SELECT * from ' + table)
        for record in cur:
            print(record)

printDB()

print("Executed")

# Disconnect from DB
cur.close()
conn.close()

# Home Page
@app.get("/")
async def root():
    return {"message": "Hello World"}


# Read Kanbans
def readKanbans():
    cur = conn.cursor()
    cur.execute('')

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
