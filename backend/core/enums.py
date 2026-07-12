"""
Every status/type enum used across domains lives here. Import from here,
don't redefine the same enum inside models/social.py and models/gamification.py
just because they both happen to use "approval status" — that's how you end
up with two incompatible enums that break the scoring service later.
"""
import enum


class DepartmentStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class EmployeeStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class CategoryType(str, enum.Enum):
    CSR_ACTIVITY = "csr_activity"
    CHALLENGE = "challenge"


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ChallengeStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    UNDER_REVIEW = "under_review"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ChallengeDifficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Severity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ComplianceIssueStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


class AuditStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class PolicyStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"


class CarbonSourceType(str, enum.Enum):
    PURCHASE = "purchase"
    MANUFACTURING = "manufacturing"
    EXPENSE = "expense"
    FLEET = "fleet"
    MANUAL = "manual"


class RewardStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class RedemptionStatus(str, enum.Enum):
    COMPLETED = "completed"
    CANCELLED = "cancelled"
