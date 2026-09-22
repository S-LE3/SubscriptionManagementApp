Subscription Management Application — Full-Stack Capstone MVP
API Contract Manual

Welcome to the Master Blueprint manual for our Subscription Application API. All
sub-teams must strictly follow the JSON payloads, URI paths, and status
configurations outlined below to ensure our full-stack integration runs smoothly
without structural conflicts.

1. Unified Global Response Design Rules
To keep communications consistent across our application layers, every endpoint
on our platform must return data matching one of these two standard payload
shapes:

● Standard Success Structure (HTTP 200/201 Series)

{
  "success": true,
  "message": "Clear explanation detailing the action completed
successfully.",
  "data": {}
}

● Standard Error Structure (HTTP 4xx/5xx Series)

{
  "success": false,
  "message": "Clear description explaining exactly why the operation
fell short.",
  "data": null
}


2. Authentication Resource Contract Modules

User Registration
● Resource Path URL: POST /api/v1/auth/register
● Access Boundary Layer: Public Anonymous Public Access
● Content Encodings Type: application/json
● Incoming Request Schema Requirements:

{
  "email": "user-identity-test@phoenix.edu",
  "password": "high-entropy-character-string-here"
}


● Successful Execution Return (HTTP 201 Created):

{
  "success": true,
  "message": "Profile created successfully. Ready for session
authentication.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0de",
    "email": "user-identity-test@phoenix.edu",
    "role_level": "customer"
  }
}


Session Token Generation
● Resource Path URL: POST /api/v1/auth/login
● Access Boundary Layer: Public Anonymous Public Access
● Content Encodings Type: application/json
● Incoming Request Schema Requirements:

{
  "email": "user-identity-test@phoenix.edu",
  "password": "high-entropy-character-string-here"
}

● Successful Execution Return (HTTP 200 OK):

{
  "success": true,
  "message": "Token generated cleanly. Keep the bearer string safe
inside local storage.",
  "data": {
  "token":
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjFhMmIz..."
  }
}


3. Pricing Catalogs, Search Filters & Pagination Modules

Fetch Available Billing Plans
● Resource Path URL: GET /api/v1/plans
● Access Boundary Layer: Authenticated Session Required (Authorization:
Bearer <token_string>)
● URL Parameter Queries:
?search=PlanName&category=TierTag&page=1&limit=10
● Successful Execution Return (HTTP 200 OK):

{
   "success": true,
   "message": "Paginated plan definitions retrieved successfully.",
   "data": {
   "plans": [
     {
       "id": "64f1a2b3c4d5e6f7a8b9c0df",
       "tier_name": "Premium Tier Plan",
       "paystack_plan_code": "PLN_premium_556677",
       "tier_level": 2,
       "base_amount_units": 500000
     }
   ],
   "pagination_metadata": {
     "current_page": 1,
     "total_pages": 3,
     "total_records_volume": 28
   }
 }
}

4. Paystack Lifecycle Transaction Modules

Initialize Checkout Redirection Session
● Resource Path URL: POST /api/v1/subscriptions/subscribe
● Access Boundary Layer: Authenticated Session Required (Authorization:
Bearer <token_string>)
● Content Encodings Type: application/json
● Incoming Request Schema Requirements:

{
  "planCode": "PLN_premium_556677",
  "couponCode": "WINTERVOUCHER30"
}

● Successful Execution Return (HTTP 200 OK):

{
  "success": true,
  "message": "Checkout redirection token session generated
  successfully.",
  "data": {
  "authorization_url": "https://paystack.com",
  "transaction_reference": "TX_8899001122_M"
 }
}

Live Status Polling Synchronization Endpoint
● Resource Path URL: GET /api/v1/subscriptions/poll-status
● Access Boundary Layer: Authenticated Session Required (Authorization:
Bearer <token_string>)
● URL Parameter Queries: ?reference=TX_8899001122_M
● Successful Execution Return (HTTP 200 OK):

{
  "success": true,
  "message": "Polling synchronization verification status processed.",
  "data": {
    "transaction_reference": "TX_8899001122_M",
    "synchronization_complete": true,
    "user_account_state": {
      "subscription_status": "active",
      "plan_tier": "premium",
      "access_entitlements_granted": true
      }
   }
}

Terminate Subscription Contract Loop
● Resource Path URL: POST /api/v1/subscriptions/cancel
● Access Boundary Layer: Authenticated Session Required (Authorization:
Bearer <token_string>)
● Content Encodings Type: application/json
● Incoming Request Schema Requirements: None.
● Successful Execution Return (HTTP 200 OK):

{
  "success": true,
  "message": "Subscription set to expire at current period end. Future
charges suspended.",
  "data": {
  "status": "canceling"
  }
}

5. Global Endpoint Error Notification Reference Guide
All sub-teams must use these unified application status error codes within their
operational logic files:

HTTP Status | Context Mapping Target | Return Message Payload Strategy:
● 400 Bad Request | Form validation parameter failure or syntax violations |  "Validation Error: The structural formatting fields are incorrect."

● 401 Unauthorized | Session verification token string missing or expired | "Access Token is missing, corrupted, or has expired."

● 403 Forbidden | Entitlement checker route guards lock access due to a past-due status | "Access Denied: Premium account entitlement privileges required."

● 404 Not Found | Query database references fail to find records | "Resource Error: The targeted application identifier does not exist." 

● 500 Server Error | Unexpected backend server issues or database connectivity down | "Internal Server Error: Execution encountered unexpected errors."


