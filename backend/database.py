from dotenv import load_dotenv
import os
from contextlib import contextmanager
from psycopg2.pool import ThreadedConnectionPool

#Load environment variables
load_dotenv()
DB_HOST = os.getenv("RDS_HOSTNAME")
DB_PORT = os.getenv("RDS_PORT")
DB_USERNAME = os.getenv("RDS_USERNAME")
DB_PASSWORD = os.getenv("RDS_PASSWORD")
DB_NAME = os.getenv("RDS_DB_NAME")

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

#Initialize a global pool of connections
pool = ThreadedConnectionPool(
    minconn = 2,
    maxconn = 10,
    dsn = DATABASE_URL,
)

@contextmanager
def get_db_connection():
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)

def close_db_connection():
    pool.closeall()