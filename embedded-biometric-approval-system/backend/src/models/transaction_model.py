 from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.config.database import Base, session

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default='pending')
    approver_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='transactions')
    
    def save(self):
        """
        Save transaction to database
        """
        try:
            session.add(self)
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
    
    @classmethod
    def find_by_id(cls, transaction_id):
        """
        Find transaction by ID
        """
        return session.query(cls).filter_by(id=transaction_id).first()
    
    @classmethod
    def find_all_pending(cls):
        """
        Find all pending transactions
        """
        return session.query(cls).filter_by(status='pending').all()
    
    @classmethod
    def find_by_user_id(cls, user_id):
        """
        Find transactions by user ID
        """
        return session.query(cls).filter(
            (cls.sender_id == user_id) | (cls.recipient_id == user_id)
        ).all()
