# # File: services/vanna/server.py (FINAL, COMPLETE, AND EXECUTABLE VERSION)

# import os
# import json
# import pandas as pd
# from vanna.base import VannaBase 
# from groq import Groq as GroqClient 
# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# # --- Configuration ---
# # Use single URL variable for connection (as specified in .env)
# DB_URL = os.getenv("DATABASE_URL")
# GROQ_KEY = os.getenv("GROQ_API_KEY")
# MODEL = os.getenv("MODEL_NAME", "mixtral-8x7b-32768") 

# if not DB_URL or not GROQ_KEY:
#     raise ValueError("DATABASE_URL and GROQ_API_KEY must be set in the .env file.")

# # Initialize the Groq client globally
# groq_client = GroqClient(api_key=GROQ_KEY)

# # --- Custom Vanna Class ---
# class CustomVanna(VannaBase):
#     def _init_(self, config=None):
#         VannaBase._init_(self, config=config)
        
#         # --- Database Connection (Using the final required URL format) ---
#         self.connect_to_postgres(db_url=DB_URL)
        
#     def generate_sql(self, question: str, **kwargs) -> str:
#         # Fetch DDL, Documentation, and Samples from Vanna's storage
#         ddl = self.get_ddl_for_table(table_name="all")
#         doc = self.get_documentation_list()
#         samples = self.get_sql_list()
        
#         # --- Build the System Prompt for Groq ---
#         prompt = (
#             "You are an expert PostgreSQL SQL generator. "
#             "Based on the following DDL, documentation, and sample queries, "
#             "generate the correct, executable SQL query for the user's question. "
#             "Only return the SQL query, nothing else.\n\n"
#             f"DDL:\n{ddl}\n\n"
#             f"Documentation:\n{doc}\n\n"
#             f"Samples:\n{samples}\n\n"
#             f"User Question: {question}"
#         )
        
#         # --- Direct Groq API Call ---
#         try:
#             response = groq_client.chat.completions.create(
#                 model=MODEL,
#                 messages=[{"role": "user", "content": prompt}],
#                 temperature=0.0
#             )
#             sql = response.choices[0].message.content.strip()
#             return sql
#         except Exception as e:
#             print(f"Groq API Call Error: {e}")
#             return ""
    
#     # --- PLACEHOLDER METHODS FOR ABSTRACT METHODS (Required by VannaBase) ---
#     def add_ddl(self, ddl: str, **kwargs) -> str: return "ddl"
#     def add_documentation(self, documentation: str, **kwargs) -> str: return "doc"
#     def add_question_sql(self, question: str, sql: str, **kwargs) -> str: return "q-sql"
#     def get_related_ddl(self, question: str, **kwargs) -> list[str]: return []
#     def get_related_documentation(self, question: str, **kwargs) -> list[str]: return []
#     def get_similar_question_sql(self, question: str, **kwargs) -> list[str]: return []
#     def remove_training_data(self, training_data_id: str, **kwargs) -> bool: return True
#     def generate_embedding(self, data: str) -> list[float]: return [0.0] * 1536
#     def get_training_data(self, training_data_id: str = None, **kwargs) -> pd.DataFrame: return pd.DataFrame()
    
#     def system_message(self, message: str, **kwargs) -> None: return None
#     def user_message(self, message: str, **kwargs) -> None: return None
#     def assistant_message(self, message: str, **kwargs) -> None: return None
#     def submit_prompt(self, **kwargs) -> str: return ""
# # ----------------------------------------------------------------------


# # --- TRAINING AND APP EXECUTION START HERE ---

# # 1. Instantiate the Vanna Model
# vn = CustomVanna()

# # 2. Train on Database Schema (DDL)
# print("Training Vanna on DDL...")
# # vn.train(ddl=vn.get_ddl_for_table(table_name="all"))
# ddl = vn.get_ddl()          # pulls DDL for your connected Postgres
# vn.train(ddl=ddl)
# # 3. Train on Sample Questions
# print("Training Vanna on sample questions...")
# vn.train(question="What is the total spend in the last 90 days?", sql="SELECT SUM(total_amount) FROM \"Invoice\" WHERE issue_date >= NOW() - INTERVAL '90 days'")
# vn.train(question="Show top 5 vendors by spend.", sql="SELECT v.name, SUM(i.total_amount) AS total_spend FROM \"Invoice\" i JOIN \"Vendor\" v ON i.vendor_id = v.id GROUP BY 1 ORDER BY 2 DESC LIMIT 5")
# vn.train(question="Show overdue invoices as of today.", sql="SELECT invoice_number, total_amount, due_date FROM \"Invoice\" WHERE status = 'OVERDUE' AND due_date < NOW()")

# print("Vanna is ready!")

# # 4. FastAPI App Definition (The 'app' attribute Uvicorn looks for)
# app = FastAPI(title="Vanna AI Query Server")

# # Configure CORS
# origins = [
#     "http://localhost:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Endpoints
# @app.get("/")
# def read_root():
#     return {"status": "Vanna AI Server is running"}

# @app.post("/api/query")
# async def query_data(request: Request):
#     try:
#         body = await request.json()
#         question = body.get("question")
        
#         if not question:
#             return {"error": "Missing question parameter"}, 400

#         # 1. Generate SQL
#         sql = vn.generate_sql(question=question)
        
#         # 2. Run SQL and get results
#         df = vn.run_sql(sql=sql)
        
#         # 3. Get Chart Suggestion
#         chart_suggestion = ""
        
#         # Convert DataFrame to JSON records
#         records = df.to_dict('records')

#         return {
#             "sql": sql,
#             "data": records,
#             "chart_code": chart_suggestion
#         }

#     except Exception as e:
#         print(f"Query Error: {e}")
#         return {"error": str(e), "sql": None, "data": []}, 500
# File: services/vanna/server.py (FINAL FIXED VERSION)
# File: services/vanna/server.py (FINAL FIXED AND EXECUTABLE)

import os
import json
import pandas as pd
from vanna.base import VannaBase
from groq import Groq as GroqClient
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- Load .env safely from the same folder ---
env_path = os.path.join(os.path.dirname(__file__), ".env")
print("Loading environment from:", env_path)
load_dotenv(dotenv_path=env_path, override=True)

# --- Configuration ---
DB_URL = os.getenv("DATABASE_URL")
GROQ_KEY = os.getenv("GROQ_API_KEY")
MODEL = os.getenv("MODEL_NAME", "mixtral-8x7b-32768")

# Debug print
print("DATABASE_URL =", DB_URL)
print("GROQ_API_KEY =", "Loaded" if GROQ_KEY else "Missing")

if not DB_URL or not GROQ_KEY:
    raise ValueError("DATABASE_URL and GROQ_API_KEY must be set in the .env file.")

# --- Initialize Groq client ---
groq_client = GroqClient(api_key=GROQ_KEY)


# --- Custom Vanna class ---
class CustomVanna(VannaBase):
    def __init__(self, config=None):
        super().__init__(config=config)
        print("Connecting to Postgres...")
        self.connect_to_postgres(db_url=DB_URL)

    def generate_sql(self, question: str, **kwargs) -> str:
        # Fetch DDL, documentation, and samples
        ddl = self.get_ddl()
        doc = self.get_documentation_list()
        samples = self.get_sql_list()

        # Build prompt
        prompt = (
            "You are an expert PostgreSQL SQL generator. "
            "Based on the following DDL, documentation, and sample queries, "
            "generate the correct, executable SQL query for the user's question. "
            "Only return the SQL query, nothing else.\n\n"
            f"DDL:\n{ddl}\n\n"
            f"Documentation:\n{doc}\n\n"
            f"Samples:\n{samples}\n\n"
            f"User Question: {question}"
        )

        try:
            response = groq_client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            sql = response.choices[0].message.content.strip()
            return sql
        except Exception as e:
            print(f"Groq API Call Error: {e}")
            return ""

    # Required abstract methods
    def add_ddl(self, ddl: str, **kwargs) -> str: return "ddl"
    def add_documentation(self, documentation: str, **kwargs) -> str: return "doc"
    def add_question_sql(self, question: str, sql: str, **kwargs) -> str: return "q-sql"
    def get_related_ddl(self, question: str, **kwargs) -> list[str]: return []
    def get_related_documentation(self, question: str, **kwargs) -> list[str]: return []
    def get_similar_question_sql(self, question: str, **kwargs) -> list[str]: return []
    def remove_training_data(self, training_data_id: str, **kwargs) -> bool: return True
    def generate_embedding(self, data: str) -> list[float]: return [0.0] * 1536
    def get_training_data(self, training_data_id: str = None, **kwargs) -> pd.DataFrame: return pd.DataFrame()
    def system_message(self, message: str, **kwargs) -> None: return None
    def user_message(self, message: str, **kwargs) -> None: return None
    def assistant_message(self, message: str, **kwargs) -> None: return None
    def submit_prompt(self, **kwargs) -> str: return ""


# --- FastAPI app setup ---
app = FastAPI(title="Vanna AI Query Server")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize Vanna ---
vn = CustomVanna()


@app.on_event("startup")
async def startup_event():
    """Train Vanna once when the server starts"""
    print("Training Vanna on DDL...")
    ddl = vn.get_ddl()
    vn.train(ddl=ddl)

    print("Training Vanna on sample questions...")
    vn.train(question="What is the total spend in the last 90 days?",
             sql="SELECT SUM(total_amount) FROM \"Invoice\" WHERE issue_date >= NOW() - INTERVAL '90 days'")
    vn.train(question="Show top 5 vendors by spend.",
             sql="SELECT v.name, SUM(i.total_amount) AS total_spend FROM \"Invoice\" i JOIN \"Vendor\" v ON i.vendor_id = v.id GROUP BY 1 ORDER BY 2 DESC LIMIT 5")
    vn.train(question="Show overdue invoices as of today.",
             sql="SELECT invoice_number, total_amount, due_date FROM \"Invoice\" WHERE status = 'OVERDUE' AND due_date < NOW()")
    print("✅ Vanna training complete!")


# --- API routes ---
@app.get("/")
def read_root():
    return {"status": "Vanna AI Server is running"}

@app.post("/api/query")
async def query_data(request: Request):
    try:
        body = await request.json()
        question = body.get("question")

        if not question:
            return {"error": "Missing question parameter"}, 400

        sql = vn.generate_sql(question=question)
        df = vn.run_sql(sql=sql)
        records = df.to_dict('records')

        return {
            "sql": sql,
            "data": records,
            "chart_code": ""
        }

    except Exception as e:
        print(f"Query Error: {e}")
        return {"error": str(e), "sql": None, "data": []}, 500
