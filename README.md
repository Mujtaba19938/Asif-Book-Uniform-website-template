# Asif Book & Uniform - Bookstore & School Supplies E-Commerce Template

A modern, responsive e-commerce web platform for Pakistani syllabus textbooks, school uniforms, and school/office stationery, built upon the Bookworm HTML5 template.

![Asif Book & Uniform Logo](assets/img/logo.png)

---

## 🌟 Key Features

### 1. Pakistani Syllabus Books
- **Comprehensive Catalog**: 95+ authentic textbooks covering:
  - Playgroup, Nursery & Kindergarten
  - Primary (Class 1–5)
  - Middle School (Class 6–8)
  - Matric & Secondary (Class 9–10)
  - Intermediate & FSc (Class 11–12)
  - Cambridge O Levels & A Levels
- **Official ISBN-13 Integration**: Real, verified 13-digit ISBNs sourced from [Oxford University Press Pakistan](https://oup.com.pk/) and National Curriculum boards.
- **Instant ISBN Search**: Direct search by ISBN, title, subject, grade, or publisher.
- **Multifaceted Filtering**: Filter dynamically by Grade/Class, Board/Curriculum (OUP, SNC, FBISE, PCTB, Cambridge), and Subject.

### 2. School Uniforms & Accessories
- Comprehensive uniform offerings for boys and girls:
  - Classic White Formal Shirts & Oxford Trousers
  - Pakistani White Shalwar Kameez School Uniforms
  - Girls' White Uniform Kameez with Green Dopattas
  - Winter Wool V-Neck Sweaters & Formal School Blazers
  - Formal Black Leather School Shoes & Socks
  - Striped School Ties & Belts
- Interactive size selectors (24–40) and color variation pickers with instant feedback.

### 3. Stationery & School Supplies
- Premium school and office stationery:
  - Four-line, single-line, and square-grid notebooks
  - Mathematical geometry boxes and instrument sets
  - Fountain pens, ballpoints, gel pens, and lead pencils
  - Watercolor sets, poster colors, and sketchbooks
  - Ergonomic water-resistant school backpacks
  - Ring binders, display folders, and filing accessories

### 4. Interactive Shopping Experience
- **Client-Side Cart Engine (`BOOKWORM_CART`)**:
  - Live item counter badge in header
  - Persistent storage across browser sessions (`localStorage`)
  - Off-canvas slide-out cart drawer with item removal, quantity adjustment, and subtotal calculation
  - Instant toast notification upon adding to cart
- **Dynamic Product Detail Page (`product-detail.html`)**:
  - URL parameter-driven (`?id=...`)
  - Image gallery with zoom preview
  - Variation pickers for size and color
  - Quantity stepper
  - Technical specifications table with ISBN-13, SKU, and publisher details
  - Related products carousel

---

## 📁 Project Structure

```text
├── assets/
│   ├── css/                       # Template & Bootstrap stylesheets
│   ├── fonts/                     # Web fonts & icons (Flaticon, FontAwesome)
│   ├── img/
│   │   ├── logo.png               # Official Asif Book & Uniform brand logo
│   │   ├── hero-syllabus-books.png # Custom 5-book hero banner composite
│   │   └── products/              # Product imagery
│   │       ├── books/             # Syllabus textbook covers (OUP, FBISE, PCTB)
│   │       ├── uniforms/          # Uniform photography
│   │       └── stationery/        # Stationery product imagery
│   └── js/
│       ├── products-data.js       # Complete product dataset & cart engine
│       └── shop-engine.js         # Reactive filtering, sorting & search engine
├── index.html                     # Homepage with hero slider & departmental showcases
├── syllabus-books.html            # Syllabus books category page with sidebar filters
├── school-uniforms.html           # Uniforms category page with gender & type filters
├── stationery.html                # Stationery category page with category & brand filters
├── product-detail.html            # Dynamic product detail page template
└── README.md
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mujtaba19938/Asif-Book-Uniform-website-template.git
   ```

2. **Open the project:**
   Simply open `index.html` in any modern web browser or serve via any static HTTP server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   ```

3. **Navigate to pages:**
   - Homepage: `http://localhost:8000/index.html`
   - Syllabus Books: `http://localhost:8000/syllabus-books.html`
   - School Uniforms: `http://localhost:8000/school-uniforms.html`
   - Stationery: `http://localhost:8000/stationery.html`

---

## 📄 License & Credits
- Design based on the Bookworm HTML5 Bookstore Template.
- Custom extensions, departmental additions, and data modeling developed for **Asif Book & Uniform**.

