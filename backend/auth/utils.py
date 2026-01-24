"""
Auth Utilities - Password Hashing & JWT Tokens

🎓 LESSON: Why Hash Passwords?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEVER store passwords as plain text! If your database gets hacked,
all passwords are exposed. Instead, we use "hashing":

1. User creates password: "mypassword123"
2. We hash it: "$2b$12$LQv3c1yqBWV..." (one-way, can't reverse)
3. Store the HASH, not the password
4. On login: hash what they typed, compare with stored hash

bcrypt is special because:
- It's SLOW on purpose (hackers can't brute-force quickly)
- Each hash has a random "salt" (same password = different hash)
- Industry standard for 20+ years

🎓 LESSON: What is JWT?
━━━━━━━━━━━━━━━━━━━━━━━
JWT = JSON Web Token - a way to prove "I'm logged in" without
hitting the database on every request.

Structure: xxxxx.yyyyy.zzzzz
- Header: Algorithm used (HS256)
- Payload: Your data (user_id, email, expiry time)
- Signature: Proves it wasn't tampered with

Flow:
1. User logs in with email/password
2. Server creates JWT with user info
3. Client stores JWT (localStorage or cookie)
4. Client sends JWT with every request
5. Server verifies JWT signature = user is authenticated!
"""

from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional

import sys
from pathlib import Path
# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config import settings


# Password hashing context
# bcrypt is the algorithm, "auto" means it will auto-upgrade old hashes
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password from user
        
    Returns:
        Hashed password string (safe to store in database)
        
    Example:
        >>> hash_password("mypassword123")
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJq...'
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if a password matches the hash.
    
    Args:
        plain_password: What the user typed
        hashed_password: What's stored in database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token.
    
    Args:
        data: Payload to encode (usually {"sub": user_id})
        expires_delta: How long until token expires
        
    Returns:
        JWT token string
        
    Example:
        >>> create_access_token({"sub": "user123"})
        'eyJhbGciOiJIUzI1NiIs...'
    """
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    
    # Create the token
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.jwt_secret, 
        algorithm=settings.jwt_algorithm
    )
    
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token.
    
    Args:
        token: The JWT string
        
    Returns:
        Decoded payload if valid, None if invalid/expired
    """
    try:
        payload = jwt.decode(
            token, 
            settings.jwt_secret, 
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None
