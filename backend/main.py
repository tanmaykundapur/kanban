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
    arr = []
    for record in cur:
        print(record)
        kanbanObject = {
            "id" : record[0],
            "title": record[1],
            "user_id": record[2]
        }
        arr.append(kanbanObject)
        out = {
            "kanbans" : arr
        }
    cur.close()
    return out

# Read Columns
@app.get("/columns")
def readColumns():
    print("Reading columns...")
    cur = conn.cursor()
    cur.execute('SELECT * from columns')
    arr = []
    for col in cur:
        colObject = {
            "column_id": col[0],
            "column_title": col[1],
            "user_id": col[2],
            "kanban_id": col[3]
        }
        arr.append(colObject)
        out = {"columns": arr}
        print(colObject)
    cur.close()
    return out
        
# Read Tasks
@app.get("/tasks")
def readTasks():
    print("Reading Tasks...")
    cur = conn.cursor()
    cur.execute("SELECT * from tasks")
    tasks = []
    for task in cur:
        taskObject = {
            "task_id": task[0],
            "task_content": task[1],
            "task_status": task[2],
            "user_id": task[3],
            "kanban_id": task[4],
            "column_id": task[5]
        }
        tasks.append(taskObject)
    cur.close()
    return {"tasks": tasks}

# Create Kanban
# Create Column
# Create Task
# Update Task
# Delete Task

# Disconnect from DB
# conn.close()