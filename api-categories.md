# Categories API Documentation

This document contains the API documentation for the Categories module in the application.

## Base URL
All API endpoints are relative to NEXT_PUBLIC_API_URL=https://besukma.vercel.app that is available in .env file

## Authentication
All category API endpoints require authentication using Clerk. Include the Authorization header with a valid Bearer token.

## Endpoints

### 1. Get All Categories

**GET** `/api/categories`

Fetches all categories with pagination support.

#### Parameters
- `page` (optional, integer): Page number for pagination (default: 1)
- `limit` (optional, integer): Number of categories per page (default: 10)

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      "image": "https://ik.imagekit.io/your-folder/...",
      "status": "ACTIVE",
      "slug": "electronics",
      "metaTitle": "Electronics Category",
      "metaDescription": "All electronic devices",
      "sortOrder": 0,
      "parentCategoryId": null,
      "parentCategory": null,
      "subcategories": [],
      "createdAt": "2023-11-09T10:00:00.000Z",
      "updatedAt": "2023-11-09T10:00:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### Example Request
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/categories?page=1&limit=10
```

---

### 2. Create a Category

**POST** `/api/categories`

Creates a new category with image upload support.

#### Form Data Parameters
- `name` (required, string): Name of the category
- `description` (optional, string): Description of the category
- `image` (optional, file): Category image file to upload
- `status` (optional, string): Status of the category (ACTIVE/INACTIVE) (default: ACTIVE)
- `metaTitle` (optional, string): Meta title for SEO
- `metaDescription` (optional, string): Meta description for SEO
- `sortOrder` (optional, integer): Sort order (default: 0)
- `parentCategoryId` (optional, integer): ID of the parent category
- `slug` (optional, string): URL slug (auto-generated from name if not provided)

#### Response
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Mobile Phones",
    "description": "Smartphones and mobile devices",
    "image": "https://ik.imagekit.io/your-folder/mobile-phones.webp",
    "status": "ACTIVE",
    "slug": "mobile-phones",
    "metaTitle": "Mobile Phones Category",
    "metaDescription": "All mobile phones available",
    "sortOrder": 1,
    "parentCategoryId": 1,
    "parentCategory": {
      "id": 1,
      "name": "Electronics",
      // ... other parent category fields
    },
    "subcategories": [],
    "createdAt": "2023-11-09T10:30:00.000Z",
    "updatedAt": "2023-11-09T10:30:00.000Z"
  }
}
```

#### Example Request
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Mobile Phones" \
  -F "description=Smartphones and mobile devices" \
  -F "image=@/path/to/image.jpg" \
  -F "status=ACTIVE" \
  -F "sortOrder=1" \
  -F "parentCategoryId=1" \
  http://localhost:3000/api/categories
```

---

### 3. Get a Category by ID

**GET** `/api/categories/[id]`

Fetches a specific category by its ID.

#### Path Parameters
- `id` (required, integer): Category ID

#### Response
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Mobile Phones",
    "description": "Smartphones and mobile devices",
    "image": "https://ik.imagekit.io/your-folder/mobile-phones.webp",
    "status": "ACTIVE",
    "slug": "mobile-phones",
    "metaTitle": "Mobile Phones Category",
    "metaDescription": "All mobile phones available",
    "sortOrder": 1,
    "parentCategoryId": 1,
    "parentCategory": {
      "id": 1,
      "name": "Electronics",
      // ... other parent category fields
    },
    "subcategories": [
      {
        "id": 3,
        "name": "iPhone",
        // ... other subcategory fields
      }
    ],
    "createdAt": "2023-11-09T10:30:00.000Z",
    "updatedAt": "2023-11-09T10:30:00.000Z"
  }
}
```

#### Example Request
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/categories/2
```

---

### 4. Update a Category

**PUT** `/api/categories/[id]`

Updates an existing category with optional image upload.

#### Path Parameters
- `id` (required, integer): Category ID

#### Form Data Parameters
- `name` (required, string): Name of the category
- `description` (optional, string): Description of the category
- `image` (optional, file): New category image file to upload (will replace existing)
- `status` (optional, string): Status of the category (ACTIVE/INACTIVE)
- `metaTitle` (optional, string): Meta title for SEO
- `metaDescription` (optional, string): Meta description for SEO
- `sortOrder` (optional, integer): Sort order
- `parentCategoryId` (optional, integer): ID of the parent category
- `slug` (optional, string): URL slug (auto-generated from name if not provided)

#### Response
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Updated Mobile Phones",
    "description": "Updated smartphones and mobile devices",
    "image": "https://ik.imagekit.io/your-folder/updated-mobile-phones.webp",
    "status": "ACTIVE",
    "slug": "updated-mobile-phones",
    "metaTitle": "Updated Mobile Phones Category",
    "metaDescription": "All updated mobile phones available",
    "sortOrder": 2,
    "parentCategoryId": 1,
    "parentCategory": {
      "id": 1,
      "name": "Electronics",
      // ... other parent category fields
    },
    "subcategories": [
      {
        "id": 3,
        "name": "iPhone",
        // ... other subcategory fields
      }
    ],
    "createdAt": "2023-11-09T10:30:00.000Z",
    "updatedAt": "2023-11-09T11:00:00.000Z"
  }
}
```

#### Example Request
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Updated Mobile Phones" \
  -F "description=Updated smartphones and mobile devices" \
  -F "image=@/path/to/new-image.jpg" \
  -F "status=ACTIVE" \
  -F "sortOrder=2" \
  -F "parentCategoryId=1" \
  http://localhost:3000/api/categories/2
```

---

### 5. Delete a Category

**DELETE** `/api/categories/[id]`

Deletes a category by its ID. Note: This will set parentCategoryId to null for any subcategories before deletion.

#### Path Parameters
- `id` (required, integer): Category ID

#### Response
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

#### Example Request
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/categories/2
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
- `400`: Bad Request - Missing required fields or invalid data
- `404`: Not Found - Category not found
- `500`: Internal Server Error - Unexpected error occurred