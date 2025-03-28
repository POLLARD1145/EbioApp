from flask import Blueprint, request, jsonify
from src.models.transaction_model import Transaction
from src.services.blockchain_service import BlockchainService
from src.services.security_service import authenticate_request

transaction_bp = Blueprint('transactions', __name__)

class TransactionController:
    @staticmethod
    @transaction_bp.route('/create', methods=['POST'])
    @authenticate_request
    def create_transaction(current_user):
        try:
            data = request.get_json()
            
            # Validate input
            if not all(key in data for key in ['amount', 'recipient']):
                return jsonify({'error': 'Missing required transaction details'}), 400
            
            # Create transaction
            transaction = Transaction(
                sender_id=current_user.id,
                recipient_id=data['recipient'],
                amount=data['amount'],
                status='pending'
            )
            transaction.save()
            
            # Submit to blockchain service
            blockchain_service = BlockchainService()
            blockchain_result = blockchain_service.submit_transaction(transaction)
            
            return jsonify({
                'message': 'Transaction created successfully',
                'transaction_id': transaction.id,
                'blockchain_status': blockchain_result
            }), 201
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @transaction_bp.route('/approve', methods=['POST'])
    @authenticate_request
    def approve_transaction(current_user):
        try:
            data = request.get_json()
            transaction_id = data.get('transaction_id')
            
            if not transaction_id:
                return jsonify({'error': 'Transaction ID required'}), 400
            
            # Find transaction
            transaction = Transaction.find_by_id(transaction_id)
            if not transaction:
                return jsonify({'error': 'Transaction not found'}), 404
            
            # Check user permissions
            if current_user.role not in ['admin', 'approver']:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            # Approve transaction
            transaction.status = 'approved'
            transaction.approver_id = current_user.id
            transaction.save()
            
            # Process blockchain approval
            blockchain_service = BlockchainService()
            blockchain_result = blockchain_service.confirm_transaction(transaction)
            
            return jsonify({
                'message': 'Transaction approved',
                'transaction_id': transaction.id,
                'blockchain_status': blockchain_result
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @transaction_bp.route('/list', methods=['GET'])
    @authenticate_request
    def list_transactions(current_user):
        try:
            # Filter transactions based on user role
            if current_user.role in ['admin', 'approver']:
                transactions = Transaction.find_all_pending()
            else:
                transactions = Transaction.find_by_user_id(current_user.id)
            
            return jsonify({
                'transactions': [
                    {
                        'id': tx.id,
                        'amount': tx.amount,
                        'sender': tx.sender_id,
                        'recipient': tx.recipient_id,
                        'status': tx.status
                    } for tx in transactions
                ]
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
