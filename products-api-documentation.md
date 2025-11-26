# Products API Documentation

This document contains the API documentation for the Products module in the application.

## Base URL
All API endpoints are relative to your application's base URL.

## Authentication
All product API endpoints require authentication using Clerk. The API will automatically determine the store based on the authenticated user's ID.

## Endpoints

### 1. Create New Product

**POST** `/api/store/product`

Creates a new product for the authenticated user's store.

#### Form Data Parameters
- `name` (required, string): Name of the product
- `description` (required, string): Detailed description of the product
- `mrp` (required, number): Maximum retail price of the product
- `price` (required, number): Selling price of the product
- `category` (required, string): ID of the category for the product
- `images` (required, file[]): Array of image files for the product (minimum 1)
- `inStock` (optional, boolean): Whether the product is in stock (default: true)
- `stock` (optional, number): Quantity of stock available (default: 0)
- `minStock` (optional, number): Minimum stock level (default: 0)
- `weight` (optional, string): Weight of the product (e.g., "1.5 kg")
- `dimensions` (optional, string): Dimensions of the product (e.g., "10 x 5 x 3 cm")
- `model` (optional, string): Model of the product
- `additionalInfo` (optional, string): Additional information about the product
- `status` (optional, string): Status of the product (default: "draft", options: "draft", "published", "archived")
- `sku` (optional, string): Stock Keeping Unit identifier
- `barcode` (optional, string): Barcode identifier
- `shippingWeight` (optional, string): Shipping weight of the product
- `shippingLength` (optional, string): Shipping length of the product
- `shippingWidth` (optional, string): Shipping width of the product
- `shippingHeight` (optional, string): Shipping height of the product
- `warranty` (optional, string): Warranty information
- `returnPolicy` (optional, string): Return policy information
- `tags` (optional, string): Tags associated with the product (comma separated)
- `metaTitle` (optional, string): Meta title for SEO purposes
- `metaDescription` (optional, string): Meta description for SEO purposes

#### Response
```json
{
  "message": "Product added successfully"
}
```

#### Example Request
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Wireless Headphones" \
  -F "description=High-quality wireless headphones with noise cancellation" \
  -F "mrp=199.99" \
  -F "price=149.99" \
  -F "category=cat_1234567890" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "inStock=true" \
  -F "stock=50" \
  -F "sku=WH-2023-001" \
  -F "barcode=1234567890123" \
  -F "status=published" \
  http://localhost:3000/api/store/product
```

---

### 2. Get All Products for Store

**GET** `/api/store/product`

Fetches all products associated with the authenticated user's store.

#### Response
```json
{
  "products": [
    {
      "id": "prod_1234567890",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "mrp": 199.99,
      "price": 149.99,
      "images": [
        "https://ik.imagekit.io/your-folder/product1_image1.webp",
        "https://ik.imagekit.io/your-folder/product1_image2.webp"
      ],
      "categoryId": "cat_1234567890",
      "inStock": true,
      "stock": 50,
      "storeId": "store_0987654321",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "minStock": 5,
      "weight": "0.3 kg",
      "dimensions": "18 x 15 x 8 cm",
      "model": "WH-Model-X",
      "additionalInfo": "Bluetooth 5.0, 20hr battery life",
      "status": "published",
      "sku": "WH-2023-001",
      "barcode": "1234567890123",
      "shippingWeight": "0.4 kg",
      "shippingLength": "20 cm",
      "shippingWidth": "17 cm",
      "shippingHeight": "10 cm",
      "warranty": "1 Year",
      "returnPolicy": "30 Days",
      "tags": "wireless, headphones, noise-cancellation",
      "metaTitle": "Wireless Headphones with Noise Cancellation",
      "metaDescription": "Buy high-quality wireless headphones with noise cancellation...",
      "category": {
        "id": "cat_1234567890",
        "name": "Electronics",
        "description": "Electronic devices and accessories",
        // ... other category fields
      },
      "variants": [
        // ... product variant information
      ]
    }
  ]
}
```

#### Example Request
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/store/product
```

---

### 3. Get Product Details (Public)

**GET** `/api/products/[id]`

Fetches details for a specific product by ID, available to the public without authentication.

#### Path Parameters
- `id` (required, string): The unique identifier of the product to fetch

#### Response
```json
{
  "product": {
    "id": "prod_1234567890",
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "mrp": 199.99,
    "price": 149.99,
    "images": [
      "https://ik.imagekit.io/your-folder/product1_image1.webp",
      "https://ik.imagekit.io/your-folder/product1_image2.webp"
    ],
    "categoryId": "cat_1234567890",
    "inStock": true,
    "stock": 50,
    "storeId": "store_0987654321",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "minStock": 5,
    "weight": "0.3 kg",
    "dimensions": "18 x 15 x 8 cm",
    "model": "WH-Model-X",
    "additionalInfo": "Bluetooth 5.0, 20hr battery life",
    "status": "published",
    "sku": "WH-2023-001",
    "barcode": "1234567890123",
    "shippingWeight": "0.4 kg",
    "shippingLength": "20 cm",
    "shippingWidth": "17 cm",
    "shippingHeight": "10 cm",
    "warranty": "1 Year",
    "returnPolicy": "30 Days",
    "tags": "wireless, headphones, noise-cancellation",
    "metaTitle": "Wireless Headphones with Noise Cancellation",
    "metaDescription": "Buy high-quality wireless headphones with noise cancellation...",
    "category": {
      "id": "cat_1234567890",
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      // ... other category fields
    },
    "store": {
      // Store information
    },
    "rating": [
      // Array of ratings and reviews
    ],
    "variants": [
      // ... product variant information
    ]
  }
}
```

#### Example Request
```bash
curl -X GET \
  http://localhost:3000/api/products/prod_1234567890
```

---

### 4. Get Specific Product for Store

**GET** `/api/store/product/[id]`

Fetches details for a specific product by ID for the authenticated store owner.

#### Path Parameters
- `id` (required, string): The unique identifier of the product to fetch

#### Response
```json
{
  "product": {
    "id": "prod_1234567890",
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "mrp": 199.99,
    "price": 149.99,
    "images": [
      "https://ik.imagekit.io/your-folder/product1_image1.webp",
      "https://ik.imagekit.io/your-folder/product1_image2.webp"
    ],
    "categoryId": "cat_1234567890",
    "inStock": true,
    "stock": 50,
    "storeId": "store_0987654321",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "minStock": 5,
    "weight": "0.3 kg",
    "dimensions": "18 x 15 x 8 cm",
    "model": "WH-Model-X",
    "additionalInfo": "Bluetooth 5.0, 20hr battery life",
    "status": "published",
    "sku": "WH-2023-001",
    "barcode": "1234567890123",
    "shippingWeight": "0.4 kg",
    "shippingLength": "20 cm",
    "shippingWidth": "17 cm",
    "shippingHeight": "10 cm",
    "warranty": "1 Year",
    "returnPolicy": "30 Days",
    "tags": "wireless, headphones, noise-cancellation",
    "metaTitle": "Wireless Headphones with Noise Cancellation",
    "metaDescription": "Buy high-quality wireless headphones with noise cancellation...",
    "category": {
      "id": "cat_1234567890",
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      // ... other category fields
    },
    "variants": [
      // ... product variant information
    ]
  }
}
```

#### Example Request
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/store/product/prod_1234567890
```

---

### 5. Update Product Information

**PUT** `/api/store/product/[id]`

Updates the information for a specific product.

#### Path Parameters
- `id` (required, string): The unique identifier of the product to update

#### Form Data Parameters
- `name` (optional, string): Name of the product
- `description` (optional, string): Detailed description of the product
- `mrp` (optional, number): Maximum retail price of the product
- `price` (optional, number): Selling price of the product
- `category` (optional, string): ID of the category for the product
- `images` (optional, file[]): Additional image files for the product
- `inStock` (optional, boolean): Whether the product is in stock
- `stock` (optional, number): Quantity of stock available
- `minStock` (optional, number): Minimum stock level
- `weight` (optional, string): Weight of the product
- `dimensions` (optional, string): Dimensions of the product
- `model` (optional, string): Model of the product
- `additionalInfo` (optional, string): Additional information about the product
- `status` (optional, string): Status of the product
- `sku` (optional, string): Stock Keeping Unit identifier
- `barcode` (optional, string): Barcode identifier
- `shippingWeight` (optional, string): Shipping weight of the product
- `shippingLength` (optional, string): Shipping length of the product
- `shippingWidth` (optional, string): Shipping width of the product
- `shippingHeight` (optional, string): Shipping height of the product
- `warranty` (optional, string): Warranty information
- `returnPolicy` (optional, string): Return policy information
- `tags` (optional, string): Tags associated with the product
- `metaTitle` (optional, string): Meta title for SEO purposes
- `metaDescription` (optional, string): Meta description for SEO purposes
- `imagesToDelete` (optional, string): JSON array of image indices to delete (e.g., "[0,2]")

#### Response
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": "prod_1234567890",
    "name": "Updated Wireless Headphones",
    "description": "Updated high-quality wireless headphones with noise cancellation",
    "mrp": 199.99,
    "price": 139.99,
    "images": [
      "https://ik.imagekit.io/your-folder/product1_image1.webp",
      "https://ik.imagekit.io/your-folder/product1_image2.webp"
    ],
    "categoryId": "cat_1234567890",
    "inStock": false,
    "stock": 25,
    "storeId": "store_0987654321",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-11-10T10:00:00.000Z",
    "minStock": 5,
    "weight": "0.3 kg",
    "dimensions": "18 x 15 x 8 cm",
    "model": "WH-Model-X",
    "additionalInfo": "Bluetooth 5.0, 20hr battery life",
    "status": "published",
    "sku": "WH-2023-001",
    "barcode": "1234567890123",
    "shippingWeight": "0.4 kg",
    "shippingLength": "20 cm",
    "shippingWidth": "17 cm",
    "shippingHeight": "10 cm",
    "warranty": "1 Year",
    "returnPolicy": "30 Days",
    "tags": "wireless, headphones, noise-cancellation",
    "metaTitle": "Wireless Headphones with Noise Cancellation",
    "metaDescription": "Buy high-quality wireless headphones with noise cancellation...",
    "category": {
      "id": "cat_1234567890",
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      // ... other category fields
    },
    "variants": [
      // ... product variant information
    ]
  }
}
```

#### Example Request
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Updated Wireless Headphones" \
  -F "price=139.99" \
  -F "inStock=false" \
  -F "stock=25" \
  -F "status=published" \
  -F "imagesToDelete=[0]" \
  http://localhost:3000/api/store/product/prod_1234567890
```

---

### 6. Delete Product

**DELETE** `/api/store/product/[id]`

Deletes a specific product from the authenticated user's store.

#### Path Parameters
- `id` (required, string): The unique identifier of the product to delete

#### Response
```json
{
  "message": "Product deleted successfully"
}
```

#### Example Request
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/store/product/prod_1234567890
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing the issue"
}
```

## Common Error Status Codes
- `400`: Bad Request - Missing required fields, invalid data, category not found, SKU or barcode already exists
- `401`: Unauthorized - User not authenticated or not authorized to perform this action
- `404`: Not Found - Product not found or store not found
- `409`: Conflict - SKU or barcode already exists for another product
- `500`: Internal Server Error - An unexpected error occurred