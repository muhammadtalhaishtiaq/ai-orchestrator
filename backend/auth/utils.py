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

"""Backwards compatibility wrapper for security helpers."""

from core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)
