from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship, backref

class Play(Base):
    """
    Класс представления
    """
    __tablename__ = 'plays'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(300), nullable=False)
    image = Column(String(300), nullable=True)


class Session(Base):
    """
    Класс сеанса
    """
    __tablename__ = 'sessions'

    id = Column(Integer, primary_key=True, index=True)
    id_play = Column(Integer, ForeignKey(Play.id))
    datetime = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)

    play = relationship(Play, backref=backref("sessions", cascade="all,delete"))

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
    reservation_counter = Column(Integer, nullable=False, default=1)

class Auditorium(Base):
    """
    Класс зала
    """
    __tablename__ = 'auditoriums'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False)


class Seat(Base):
    """
    Класс места в зале
    """
    __tablename__ = 'seats'

    id = Column(Integer, primary_key=True, index=True)
    number_row = Column(Integer, nullable=False)
    number_seat = Column(Integer, nullable=False)
    id_auditorium = Column(Integer, 
        ForeignKey(Auditorium.id, 
        onupdate='CASCADE', 
        ondelete='CASCADE'), 
        nullable=False)

    auditorium = relationship(Auditorium, backref=backref("seats", cascade="all,delete"))


class Reservation(Base):
    """
    Класс брони клиента на конкретный сеанс (Session) представления (Play)
    """
    __tablename__ = 'reservations'

    id = Column(Integer, primary_key=True, index=True)
    id_session = Column(Integer, ForeignKey(Session.id))
    id_record = Column(Integer, ForeignKey(Record.id))

    session = relationship(Session, backref=backref("reservations", cascade="all,delete"))
    record = relationship(Record, backref=backref("records", cascade="all,delete"))

class ReservationsSeats(Base):
    """
    Вспомогательный класс отношения М:М брони и места в зале
    """
    __tablename__ = 'reservations_seats'

    id = Column(Integer, primary_key=True, index=True)
    id_reservation = Column(Integer, 
        ForeignKey(Reservation.id, ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    id_seat = Column(Integer, 
        ForeignKey(Seat.id, ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    reservation = relationship(Reservation, backref=backref('reservations_seats', cascade='all,delete'))
    seat = relationship(Seat, backref=backref('reservations_seats', cascade='all,delete'))
