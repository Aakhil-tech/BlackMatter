"""
OWNER: shared.

Every domain service calls notify() instead of writing to the
Notification table directly — keeps the four required trigger points
(Section 8: compliance issue raised, CSR/Challenge approval decisions,
policy acknowledgement reminders, badge unlocks) consistent and easy to
find/grep for.
"""
from sqlalchemy.orm import Session

from models.settings import ESGConfig, Notification


def notify(
    db: Session,
    employee_id: int | None,
    type: str,
    message: str,
    related_entity_type: str | None = None,
    related_entity_id: int | None = None,
) -> Notification | None:
    """TODO (shared): check ESGConfig singleton row — if notify_in_app is
    False, skip creating the in-app Notification row entirely. If
    notify_email is True, this is also where you'd trigger an email send
    (out of scope to actually implement for the hackathon — a print()
    or log line standing in for "email sent" is fine, just keep the call
    site here so it's a one-line swap later).
    """
    raise NotImplementedError
