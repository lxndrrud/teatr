from database import Base
import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.orm import relationship, backref

class User(Base):
    """
    Класс пользователя
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String(50), nullable=False, unique=True)
    email = Column(String(80), nullable=True)
    password = Column(String(100), nullable=False)

class SiteSession(Base):
    """
    Класс сеанса на сайте
    """
    __tablename__ = 'site_sessions'

    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, 
        ForeignKey(User.id, onupdate='CASCADE', ondelete='CASCADE'),
        nullable=False)
    token = Column(String(255), nullable=False)
    expiration_datetime = Column(DateTime(timezone=False), 
        nullable=False, 
        default=datetime.datetime.now() + datetime.timedelta(hours=2))

    user = relationship(User, backref=backref("site_session", cascade="all,delete"))

class Play(Base):
    """
    Класс представления
    """
    __tablename__ = 'plays'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(300), nullable=False)

class Image(Base):
    """
    Класс изображения
    """
    __tablename__ = 'images'
    
    id = Column(Integer, primary_key=True, index=True)
    filepath = Column(String(100), nullable=False)

class PlaysImages(Base):
    """
    Класс отношения М:М изображения - спектаклиs
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
    id_play = Column(Integer, 
        ForeignKey(Play.id, onupdate='CASCADE', ondelete='CASCADE'), 
        nullable=False)
    datetime = Column(DateTime, nullable=False)

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
    datetime = Column(DateTime, nullable=False, default=datetime.datetime.now())
    is_paid = Column(Boolean, nullable=False, default=False)
    code = Column(String(6), nullable=False)
    id_session = Column(Integer, ForeignKey(Session.id, onupdate='CASCADE'), nullable=False)
    id_record = Column(Integer, ForeignKey(Record.id, onupdate='CASCADE', ondelete='CASCADE'), nullable=False)

    session = relationship(Session, backref=backref("reservations", cascade="all,delete"))
    record = relationship(Record, backref=backref("reservations", cascade="all,delete"))

class SeatPrice(Base):
    """
    Класс цены билета на спектакль на конкретное место
    """
    __tablename__ = 'seats_prices'

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float, nullable=False)
    is_current = Column(Boolean, nullable=False)
    datetime = Column(DateTime, nullable=False, default=datetime.datetime.now())

    id_session = Column(Integer, 
        ForeignKey(Session.id, ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False)
    id_seat = Column(Integer, 
        ForeignKey(Seat.id, ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False)

    session = relationship(Session, backref=backref("seats_prices", cascade="all,delete"))
    seat = relationship(Seat, backref=backref("seats_prices", cascade="all,delete"))

class ReservationsToSeatPrices(Base):
    """
    Вспомогательный класс отношения 1:М брони и цены места в зале
    """
    __tablename__ = 'reservations_to_seats'

    id = Column(Integer, primary_key=True, index=True)
    id_reservation = Column(Integer, 
        ForeignKey(Reservation.id, ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    id_seat_price = Column(Integer, 
        ForeignKey(Seat.id, ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    reservation = relationship(Reservation, backref=backref('reservations_seats', cascade='all,delete'))
    seat_price = relationship(Seat, backref=backref('reservations_seats', cascade='all,delete'))


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