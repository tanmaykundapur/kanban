from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from pydantic import BaseModel

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

# Home Page
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Read Kanbans
@app.get("/kanbans")
async def readKanbans():
    print("Reading All Kanbans...")
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

# getKanban(id)
@app.get("/kanban/{id}")
def getKanban(id):
    print("Getting Kanban...")
    cur = conn.cursor()
    cur.execute("""
        SELECT k.kanban_id, k.kanban_title, 
               c.column_id, c.column_title,
               t.task_id, t.task_content, t.task_status 
        FROM kanbans k 
        LEFT JOIN columns c ON c.kanban_id = k.kanban_id 
        LEFT JOIN tasks t ON t.column_id = c.column_id
        WHERE k.kanban_id = %s
        ORDER BY c.column_id, t.task_id
        """, (id,))
    rows = cur.fetchall()
    cur.close()

    kanban = None
    columns_by_id = {}

    for (kanban_id, kanban_title, column_id, column_title, task_id, task_content, task_status) in rows:
        if kanban is None:
            kanban = {
                "kanban_id": kanban_id,
                "kanban_title": kanban_title,
                "columns": {}
            }

        column_key = str(column_id)  # always use string keys
        if column_key not in columns_by_id:
            columns_by_id[column_key] = {
                "column_id": column_id,
                "column_title": column_title,
                "tasks": []
            }

        if task_id is not None:
            columns_by_id[column_key]["tasks"].append({
                "task_id": str(task_id),  # ensure task IDs are strings for frontend
                "task_content": task_content,
                "task_status": task_status
            })

    kanban["columns"] = columns_by_id
    return kanban



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

# Create Column (#id, column)

class Task(BaseModel):
    task_id: int
    task_content: str
    task_status: str
    user_id: int
    kanban_id: int
    column_id: int

class Task1(BaseModel):
    task_content: str

# Create Task (#id, col)
@app.post("/task/{id}")
def createTask(id: int, task: Task1):
    print("Creating Task...")
    print(task)
    print("id", id)
    cur = conn.cursor()
    try:
        print(type(task))        # Task1
        print(type(task.task_content))   # str
        cur.execute(
            "INSERT INTO tasks (task_content, task_status, kanban_id) VALUES (%s, %s, %s)",
            (task.task_content, "active", id)  # Pass values as a tuple
        )
        conn.commit()
        print("Task created successfully.")
    except Exception as e:
        conn.rollback()  # Rollback if there is an error
        print(f"Error occurred: {e}")
    finally:
        cur.close()

    return {"message": "Task created successfully", "task_id": id}

@app.post("/task/{task_id}/{column_id}")
def updateTask(task_id: str, column_id: int):  # task_id as str
    print("Updating Task...", task_id, column_id)
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE tasks SET column_id = %s WHERE task_id = %s",
            (column_id, task_id),
        )
        print("Rows updated:", cur.rowcount)
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()


# Delete Task
@app.delete("/task/{task_id}")
def deleteTask(task_id: int):
    print("Deleting Task...")
    print("task_id:", task_id, type(task_id))

    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM tasks WHERE task_id = %s", (task_id,))
        conn.commit()
        print("Deleted Task successfully")
    except Exception as e:
        conn.rollback()
        print(f"Error occured: {e}")
    finally:
        cur.close()
    return {"message": "Task deleted successfully", "task_id": task_id}



# Disconnect from DB
# conn.close()