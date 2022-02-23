from database import Base
import datetime 
from pytz import timezone

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Date, Time
from sqlalchemy.orm import relationship, backref


class Image(Base):
    """
    Класс изображения
    """
    __tablename__ = 'images'
    
    id = Column(Integer, primary_key=True, index=True)
    filepath = Column(String(100), nullable=False)

class Play(Base):
    """
    Класс представления
    """
    __tablename__ = 'plays'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(300), nullable=False)

class Auditorium(Base):
    """
    Класс зала
    """
    __tablename__ = 'auditoriums'

    id = Column(Integer, primary_key=True, index=True)
    max_user_reservations = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)

class Row(Base):
    """
    Класс ряда в зале
    """
    __tablename__ = 'auditorium_rows'

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)

    id_auditorium = Column(Integer,
        ForeignKey(Auditorium.id, ondelete='CASCADE', onupdate='CASCADE'),   
        nullable=False)

    auditorium = relationship(Auditorium, backref=backref('rows', lazy='subquery', cascade='all,delete'))

class Seat(Base):
    """
    Класс ряда в зале
    """
    __tablename__ = 'auditorium_seats'

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)

    id_row = Column(Integer,
        ForeignKey(Row.id, ondelete='CASCADE', onupdate='CASCADE'),   
        nullable=False)

    row = relationship(Row, backref=backref('seats', lazy='subquery', cascade='all,delete'))


class PricePolicy(Base):
    """
    Ценовая политика
    """
    __tablename__ = 'price_policy'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=True)


class Slot(Base):
    """
    Слот ценовой политики (место в зале с ценой)
    """

    __tablename__ = 'slots'

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float, nullable=False)

    id_price_policy = Column(Integer, 
        ForeignKey(PricePolicy.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)
    id_seat = Column(Integer, 
        ForeignKey(Seat.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)

    price_policy = relationship(PricePolicy, backref=backref('slots', lazy='subquery'))
    seat = relationship(Seat, backref=backref('slots', lazy='subquery'))

class PlaysImages(Base):
    """
    Класс отношения изображения М:М спектакли
    """

    __tablename__ = 'plays_to_images'

    id = Column(Integer, primary_key=True, index=True)
    id_play = Column(Integer, 
        ForeignKey(Play.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)
    id_image = Column(Integer, 
        ForeignKey(Image.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)
    is_poster = Column(Boolean, nullable=False, default=True)

    play = relationship(Play, backref=backref("plays_images", cascade="all,delete"))
    image = relationship(Image, backref=backref("plays_images", cascade="all,delete"))


class Session(Base):
    """
    Класс сеанса
    """
    __tablename__ = 'sessions'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    is_locked = Column(Boolean, nullable=False, default=False)

    id_play = Column(Integer, 
        ForeignKey(Play.id, onupdate='CASCADE', ondelete='CASCADE'), 
        nullable=False)
    id_price_policy = Column(Integer, 
        ForeignKey(PricePolicy.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)

    play = relationship(Play, backref=backref("sessions", lazy='subquery', cascade='all,delete'))
    price_policy = relationship(PricePolicy, backref=backref("sessions", lazy='subquery', cascade='all,delete'))

class Record(Base):
    """
    Класс записи клиента
    """
    __tablename__ = 'records'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(70), nullable=False)
    firstname = Column(String(70), nullable=True, default='Не указано')
    middlename = Column(String(70), nullable=True, default='Не указано')
    lastname = Column(String(70), nullable=True, default='Не указано')


class Reservation(Base):
    """
    Класс брони клиента на конкретный сеанс (Session) представления (Play)
    """
    __tablename__ = 'reservations'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, \
        default=datetime.datetime.now(timezone('Europe/Moscow')).date())
    time = Column(Time, nullable=False, \
        default=datetime.datetime.now(timezone('Europe/Moscow')).time())
    is_paid = Column(Boolean, nullable=False, default=False)
    code = Column(String(6), nullable=False)
    is_confirmed = Column(Boolean, nullable=False, default=False)
    confirmation_code = Column(String(6), nullable=False)

    id_session = Column(Integer, 
        ForeignKey(Session.id, onupdate='CASCADE'), 
        nullable=False)
    id_record = Column(Integer, 
        ForeignKey(Record.id, onupdate='CASCADE', ondelete='CASCADE'),      
        nullable=False)

    session = relationship(Session, backref=backref("reservations", lazy='subquery', cascade="all"))
    record = relationship(Record, backref=backref("reservations", lazy='subquery', cascade="all,delete"))


class ReservationsSlots(Base):
    """
    Вспомогательный класс отношения бронь 1:М слот 
    """
    __tablename__ = 'reservations_to_slots'

    id = Column(Integer, primary_key=True, index=True)

    id_reservation = Column(Integer, 
        ForeignKey(Reservation.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)
    id_slot = Column(Integer, 
        ForeignKey(Slot.id, onupdate='CASCADE', ondelete='CASCADE'), 
        nullable=False)

    reservation = relationship(Reservation, backref=backref('reservations_slots', lazy='subquery', cascade='all,delete'))
    slot = relationship(Slot, backref=backref('reservations_slots', lazy='subquery', cascade='all,delete'))




"""
class ReservationsSeats(Base):
    " ""
    Вспомогательный класс отношения М:М брони и места в зале
    " ""
    __tablename__ = 'reservations_to_seats'

    id = Column(Integer, primary_key=True, index=True)
    id_reservation = Column(Integer, 
        ForeignKey(Reservation.id, ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    id_seat = Column(Integer, 
        ForeignKey(Seat.id, ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    reservation = relationship(Reservation, backref=backref('reservations_seats', cascade='all,delete'))
    seat = relationship(Seat, backref=backref('reservations_seats', cascade='all,delete'))

"""