import psycopg2

# Connect to DB
conn = psycopg2.connect("dbname=kanban user=tanmayk")

# Initial Seeding of DB
cur = conn.cursor()

# Terminate Idle Sessions
print("➡️ Killing idle-in-transaction sessions...")
cur.execute("""
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid <> pg_backend_pid()
  AND state = 'idle in transaction';
""")
conn.commit()
print("✅ Idle sessions terminated")

# Run SeedDB.sql
with open("./db/schema/seedDB.sql", 'r') as f:
    sql_script = f.read()
cur.execute(sql_script)

# Save to DB
conn.commit()

# Close Cursor + DB Connection
cur.close()
conn.close()