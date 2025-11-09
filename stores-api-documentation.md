# Store API Documentation

This document contains the API documentation for the authenticated user's Store in the application.

## Base URL
All API endpoints are relative to your application's base URL.

## Authentication
All store API endpoints require authentication using Clerk. The API will automatically determine the store based on the authenticated user's ID.

## Endpoints

### 1. Get Authenticated User's Store Details

**GET** `/api/store`

Fetches details for the store associated with the authenticated user.

#### Response
```json
{
  "success": true,
  "data": {
    "id": "store_1234567890",
    "userId": "user_0987654321",
    "name": "ABC Electronics",
    "username": "abcelectronics",
    "description": "Best electronics store in town",
    "address": "123 Main Street, City, Country",
    "email": "contact@abcelectronics.com",
    "contact": "+1234567890",
    "logo": "https://ik.imagekit.io/your-folder/abcelectronics.webp",
    "website": "https://abcelectronics.com",
    "categoryId": 1,
    "establishedDate": "2020-01-15T00:00:00.000Z",
    "statusReason": "Approved by admin",
    "isActive": true,
    "status": "approved",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-11-09T10:00:00.000Z",
    "totalProducts": 25,
    "totalOrders": 120,
    "totalSales": 45000.50,
    "avgRating": 4.5,
    "user": {
      "id": "user_0987654321",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://example.com/images/john.jpg"
    },
    "category": {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      // ... other category fields
    },
    "Product": [
      {
        "id": "product_123",
        "name": "Smartphone",
        "price": 599.99,
        "inStock": true
      }
    ]
  }
}
```

#### Example Request
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/store
```

---

### 2. Update Authenticated User's Store Information

**PUT** `/api/store`

Updates the store information for the authenticated user.

#### Form Data Parameters
- `name` (required, string): Name of the store
- `username` (required, string): Unique username for the store (will be converted to lowercase)
- `description` (required, string): Description of the store
- `email` (required, string): Contact email for the store
- `contact` (required, string): Contact phone number for the store
- `address` (required, string): Physical address of the store
- `logo` (optional, file): New logo image file to upload (will replace existing)
- `website` (optional, string): Official website URL
- `categoryId` (optional, integer): ID of the associated category
- `establishedDate` (optional, string): Date when the store was established (ISO format)
- `statusReason` (optional, string): Reason for status change
- `status` (optional, string): Current status of the store (default: "pending")

#### Response
```json
{
  "success": true,
  "data": {
    "id": "store_1234567890",
    "userId": "user_0987654321",
    "name": "Updated ABC Electronics",
    "username": "updatedabcelectronics",
    "description": "Updated best electronics store in town",
    "address": "456 Updated Street, City, Country",
    "email": "updated@abcelectronics.com",
    "contact": "+0987654321",
    "logo": "https://ik.imagekit.io/your-folder/updated-abcelectronics.webp",
    "website": "https://updatedabcelectronics.com",
    "categoryId": 2,
    "establishedDate": "2021-05-20T00:00:00.000Z",
    "statusReason": "Updated information by owner",
    "isActive": true,
    "status": "approved",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-11-09T11:00:00.000Z",
    "user": {
      "id": "user_0987654321",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://example.com/images/john.jpg"
    },
    "category": {
      "id": 2,
      "name": "Mobile Phones",
      "description": "Smartphones and mobile devices",
      // ... other category fields
    }
  }
}
```

#### Example Request
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Updated ABC Electronics" \
  -F "username=updatedabcelectronics" \
  -F "description=Updated best electronics store in town" \
  -F "email=updated@abcelectronics.com" \
  -F "contact=+0987654321" \
  -F "address=456 Updated Street, City, Country" \
  -F "logo=@/path/to/new-logo.jpg" \
  -F "website=https://updatedabcelectronics.com" \
  -F "categoryId=2" \
  -F "establishedDate=2021-05-20" \
  -F "statusReason=Updated information by owner" \
  -F "status=approved" \
  http://localhost:3000/api/store
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

## Common Error Status Codes
- `400`: Bad Request - Missing required fields, invalid data, or username already taken
- `404`: Not Found - Store not found
- `500`: Internal Server Error - Unexpected error occurred