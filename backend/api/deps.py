"""
Shared route dependencies. Import get_db from here in every router
instead of from core.database directly — if we add auth later
(get_current_employee), this is the one file that changes.
"""
from core.database import get_db  # re-exported on purpose

__all__ = ["get_db"]
