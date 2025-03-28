import jwt
import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.user_model import User
from src.services.security_service import generate_secure_token
from src.utils.encryption import encrypt_data, decrypt_data

auth_bp = Blueprint('auth', __name__)

class AuthController:
    @staticmethod
    @auth_bp.route('/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
            # Validate input
            if not data or not data.get('username') or not data.get('password'):
                return jsonify({'error': 'Missing username or password'}), 400
            
            # Check if user already exists
            existing_user = User.find_by_username(data['username'])
            if existing_user:
                return jsonify({'error': 'Username already exists'}), 409
            
            # Create new user
            hashed_password = generate_password_hash(data['password'])
            new_user = User(
                username=data['username'],
                password_hash=hashed_password,
                email=data.get('email'),
                role=data.get('role', 'user')
            )
            new_user.save()
            
            return jsonify({
                'message': 'User registered successfully',
                'user_id': new_user.id
            }), 201
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @auth_bp.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            # Validate input
            if not data or not data.get('username') or not data.get('password'):
                return jsonify({'error': 'Missing username or password'}), 400
            
            # Find user
            user = User.find_by_username(data['username'])
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Verify password
            if not check_password_hash(user.password_hash, data['password']):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Generate tokens
            access_token = generate_secure_token(
                user.id, 
                token_type='access', 
                expiration=datetime.timedelta(hours=1)
            )
            refresh_token = generate_secure_token(
                user.id, 
                token_type='refresh', 
                expiration=datetime.timedelta(days=7)
            )
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role
                }
            }), 200
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    @auth_bp.route('/refresh', methods=['POST'])
    def refresh_token():
        try:
            data = request.get_json()
            refresh_token = data.get('refresh_token')
            
            if not refresh_token:
                return jsonify({'error': 'Refresh token required'}), 400
            
            # Validate and decode refresh token
            payload = jwt.decode(refresh_token, verify=False)
            user_id = payload.get('sub')
            
            # Find user
            user = User.find_by_id(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Generate new access token
            new_access_token = generate_secure_token(
                user.id, 
                token_type='access', 
                expiration=datetime.timedelta(hours=1)
            )
            
            return jsonify({
                'access_token': new_access_token
            }), 200
        
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Refresh token expired'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500 
