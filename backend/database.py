from supabase import create_client, Client
from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
