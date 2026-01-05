import psycopg2


# Connect to DB
conn = psycopg2.connect("dbname=kanban user=tanmayk")

# Initial Seeding of DB
cur = conn.cursor()
with open("./db/schema/seedDB.sql", 'r') as f:
    sql_script = f.read()
cur.execute(sql_script)
cur.close()
conn.commit()
conn.close()