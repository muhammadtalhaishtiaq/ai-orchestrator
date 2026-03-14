import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from app.config import settings

def get_fernet() -> Fernet:
    """Get Fernet instance using the encryption key from settings."""
    key = settings.encryption_key.encode()
    # Ensure key is valid base64 and 32 bytes
    try:
        decoded = base64.urlsafe_b64decode(key + b'==')
        if len(decoded) < 32:
            # Derive a proper key
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'ai-orchestrator-salt',
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(settings.encryption_key.encode()))
    except Exception:
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'ai-orchestrator-salt',
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(settings.encryption_key.encode()))
    return Fernet(key)

def encrypt_value(value: str) -> str:
    """Encrypt a string value."""
    f = get_fernet()
    return f.encrypt(value.encode()).decode()

def decrypt_value(encrypted_value: str) -> str:
    """Decrypt an encrypted string value."""
    f = get_fernet()
    return f.decrypt(encrypted_value.encode()).decode()
