from typing import Optional
from sqlalchemy.orm import Session as DBSession
from models import Auditorium, PricePolicy, ReservationsSlots, Row, Seat, Session, Slot, Play



def get_sessions_query(db: DBSession, FILTER: Optional[list] = []):
    return db.query(Session.id, Session.id_play.label('id_play'), Session.is_locked, 
            Play.title.label('play_title'), Auditorium.title.label('auditorium_title'),
            PricePolicy.id.label('id_price_policy'), Session.date, Session.time) \
        .filter(*FILTER) \
        .join(Play, Play.id == Session.id_play) \
        .join(PricePolicy, PricePolicy.id == Session.id_price_policy) \
        .join(Slot, PricePolicy.id == Slot.id_price_policy) \
        .join(Seat, Seat.id == Slot.id_seat) \
        .join(Row, Row.id == Seat.id_row) \
        .join(Auditorium, Auditorium.id == Row.id_auditorium) \
        .distinct() \
        .order_by(Session.date.asc(), Session.time.asc()) \
        .all()