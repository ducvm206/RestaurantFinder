restaurant-finder/
├── client/                          # 🖥️ FRONTEND: React.js application
│   ├── public/
│   │   ├── index.html              # 📄 Main HTML template
│   │   ├── favicon.ico             # 🎯 Browser tab icon
│   │   └── locales/                # 🌐 TRANSLATION FILES
│   │       ├── ja.json             # 🇯🇵 Japanese translations
│   │       ├── en.json             # 🇺🇸 English translations
│   │       └── vi.json             # 🇻🇳 Vietnamese translations
│   ├── src/
│   │   ├── App.js                  # 🚀 Main app component & routes
│   │   ├── index.js                # ⚡ React DOM entry point
│   │   ├── components/
│   │   │   ├── common/             # ♻️ REUSABLE UI COMPONENTS
│   │   │   │   ├── Header.js       # 🧭 Top navigation bar
│   │   │   │   ├── Footer.js       # 📄 Bottom site footer
│   │   │   │   ├── Button.js       # 🔘 Standard button component
│   │   │   │   ├── Input.js        # 📝 Form input field component
│   │   │   │   ├── Card.js         # 🃏 Content container component
│   │   │   │   └── LanguageSwitcher.js # 🌐 Language selection dropdown
│   │   │   ├── auth/               # 🔐 AUTHENTICATION COMPONENTS
│   │   │   │   ├── Login.js        # 👤 User login form
│   │   │   │   ├── Register.js     # 📝 User registration form
│   │   │   │   └── ProtectedRoute.js # 🛡️ Route guard for auth pages
│   │   │   ├── profile/            # 👨‍💼 USER PROFILE MANAGEMENT
│   │   │   │   ├── ProfileScreen.js # 🖼️ Main profile page container
│   │   │   │   ├── ProfileHeader.js # 📸 Profile image & basic info
│   │   │   │   ├── ProfileBasicInfo.js # 📋 Username, bio, personal details
│   │   │   │   └── ProfileDetailCard.js # 📞 Contact info card
│   │   │   ├── restaurant/         # 🍽️ RESTAURANT FEATURES
│   │   │   │   ├── RestaurantSearch.js # 🔍 Search bar & filters
│   │   │   │   ├── RestaurantCard.js # 🎴 Restaurant preview card
│   │   │   │   ├── RestaurantDetail.js # 📊 Full restaurant details
│   │   │   │   ├── RestaurantMenu.js # 📋 Menu items display
│   │   │   │   └── RestaurantReviews.js # ⭐ Customer reviews & ratings
│   │   │   ├── favorites/          # ❤️ USER FAVORITES
│   │   │   │   └── FavoritesList.js # 💖 Saved restaurants list
│   │   │   └── review/             # ✍️ REVIEW SYSTEM
│   │   │       └── ReviewForm.js   # 📝 Write/edit restaurant reviews
│   │   ├── pages/                  # 🏠 PAGE-LEVEL COMPONENTS
│   │   │   ├── HomePage.js         # 🏠 Landing page
│   │   │   ├── SearchPage.js       # 🔍 Search results page
│   │   │   ├── ProfilePage.js      # 👤 User profile page
│   │   │   ├── RestaurantDetailPage.js # 🍽️ Single restaurant page
│   │   │   └── FavoritesPage.js    # ❤️ User favorites page
│   │   ├── hooks/                  # 🎣 CUSTOM REACT HOOKS
│   │   │   ├── useAuth.js          # 🔐 Authentication state management
│   │   │   ├── useProfile.js       # 👤 User profile data operations
│   │   │   └── useTranslation.js   # 🌐 Multi-language text handling
│   │   ├── context/                # 🎯 REACT CONTEXT STATE MANAGEMENT
│   │   │   ├── AuthContext.js      # 🔐 Global authentication state
│   │   │   └── LanguageContext.js  # 🌐 Global language preferences
│   │   ├── services/               # 🔌 API COMMUNICATION LAYER
│   │   │   ├── api.js              # 🌐 Axios instance & API config
│   │   │   ├── authService.js      # 🔐 Login, register, token management
│   │   │   ├── profileService.js   # 👤 User profile CRUD operations
│   │   │   └── restaurantService.js # 🍽️ Restaurant data fetching
│   │   ├── utils/                  # 🛠️ UTILITY FUNCTIONS
│   │   │   ├── validation.js       # ✅ Form validation rules
│   │   │   └── constants.js        # 📋 App constants & configuration
│   │   └── styles/                 # 🎨 CSS STYLESHEETS
│   │       ├── App.css             # 🎨 Global application styles
│   │       ├── Profile.css         # 👤 Profile page specific styles
│   │       └── Common.css          # ♻️ Shared utility classes
│   └── package.json               # 📦 Frontend dependencies & scripts
│
├── server/                          # 🖥️ BACKEND: Node.js + PostgreSQL API
│   ├── src/
│   │   ├── server.js               # 🚀 Express server entry point
│   │   │
│   │   ├── config/                 # ⚙️ APPLICATION CONFIGURATION
│   │   │   ├── database.js         # 🗄️ PostgreSQL connection pool setup
│   │   │   ├── config.js           # 🔧 App configuration & constants
│   │   │   └── env.js              # 🌳 Environment variable validation
│   │   │
│   │   ├── database/               # 🗄️ DATABASE LAYER
│   │   │   ├── migrations/         # 🔄 DATABASE SCHEMA VERSION CONTROL
│   │   │   │   ├── 001_create_users_table.sql              # 👥 Users table
│   │   │   │   ├── 002_create_restaurants_table.sql        # 🍽️ Restaurants table
│   │   │   │   ├── 003_create_reviews_table.sql            # ⭐ Reviews table
│   │   │   │   ├── 004_create_favorites_table.sql          # ❤️ User favorites table
│   │   │   │   ├── 005_create_menu_items_table.sql         # 📋 Restaurant menu items
│   │   │   │   └── 006_create_search_history_table.sql     # 🔍 User search history
│   │   │   ├── seeds/              # 🌱 SAMPLE DATA FOR DEVELOPMENT
│   │   │   │   ├── 001_seed_users.sql                      # 👥 Test user accounts
│   │   │   │   ├── 002_seed_restaurants.sql                # 🍽️ Sample restaurants
│   │   │   │   └── 003_seed_menu_items.sql                 # 📋 Sample menu items
│   │   │   └── queries/                # 📝 REUSABLE SQL QUERIES
│   │   │       ├── userQueries.js                          # 👤 User-related SQL queries
│   │   │       ├── restaurantQueries.js                    # 🍽️ Restaurant SQL queries
│   │   │       ├── reviewQueries.js                        # ⭐ Review SQL queries
│   │   │       └── favoriteQueries.js                      # ❤️ Favorites SQL queries
│   │   │
│   │   ├── controllers/            # 🎮 REQUEST HANDLERS (BUSINESS LOGIC)
│   │   │   ├── authController.js                           # 🔐 Login, register, logout
│   │   │   ├── profileController.js                        # 👤 User profile CRUD operations
│   │   │   ├── restaurantController.js                     # 🍽️ Restaurant data management
│   │   │   ├── reviewController.js                         # ⭐ Review creation & management
│   │   │   └── favoriteController.js                       # ❤️ Favorites management
│   │   │
│   │   ├── models/                 # 🏗️ DATA ACCESS LAYER (PURE SQL)
│   │   │   ├── User.js             # 👤 User data operations
│   │   │   ├── Restaurant.js       # 🍽️ Restaurant data operations
│   │   │   ├── Review.js           # ⭐ Review data operations
│   │   │   ├── Favorite.js         # ❤️ Favorite data operations
│   │   │   └── MenuItem.js         # 📋 Menu item data operations
│   │   │
│   │   ├── routes/                 # 🛣️ API ROUTE DEFINITIONS
│   │   │   ├── index.js            # 🗺️ Main router combining all routes
│   │   │   ├── authRoutes.js       # 🔐 Authentication endpoints
│   │   │   ├── profileRoutes.js    # 👤 Profile management endpoints
│   │   │   ├── restaurantRoutes.js # 🍽️ Restaurant data endpoints
│   │   │   ├── reviewRoutes.js     # ⭐ Review endpoints
│   │   │   └── favoriteRoutes.js   # ❤️ Favorites endpoints
│   │   │
│   │   ├── middleware/             # 🛡️ REQUEST PROCESSING MIDDLEWARE
│   │   │   ├── authMiddleware.js   # 🔐 JWT token verification
│   │   │   ├── validation.js       # ✅ Request data validation
│   │   │   ├── errorHandler.js     # ❌ Global error handling
│   │   │   └── rateLimiter.js      # 🚦 API rate limiting
│   │   │
│   │   ├── utils/                  # 🛠️ BACKEND UTILITIES
│   │   │   ├── validators.js       # ✅ Input validation schemas
│   │   │   ├── helpers.js          # 🛠️ Helper functions
│   │   │   ├── passwordHash.js     # 🔒 Password hashing utilities
│   │   │   └── jwtUtils.js         # 🎫 JWT token generation/verification
│   │   │
│   │   └── scripts/                # 📜 DATABASE MANAGEMENT SCRIPTS
│   │       ├── runMigrations.js    # 🔼 Run database migrations
│   │       ├── rollbackMigrations.js # 🔽 Rollback migrations
│   │       ├── seedDatabase.js     # 🌱 Populate with sample data
│   │       └── resetDatabase.js    # 💥 Reset database (dev only)
│   │
│   ├── tests/                      # 🧪 TESTING SUITE
│   │   ├── unit/                   # 🧩 Unit tests for individual functions
│   │   ├── integration/            # 🔗 API endpoint integration tests
│   │   └── e2e/                    # 🌐 End-to-end user flow tests
│   │
│   ├── package.json               # 📦 Backend dependencies & scripts
│   └── .env.example               # 📋 Example environment variables
│
├── database/                        # 🗄️ DATABASE DOCUMENTATION & SCRIPTS
│   ├── schema/
│   │   ├── ERD.png                # 🗺️ Entity Relationship Diagram (visual schema)
│   │   └── schema_design.md       # 📋 Database design documentation
│   ├── docs/
│   │   ├── database_setup.md      # 🛠️ Database installation & setup guide
│   │   └── migration_guide.md     # 🔄 How to create/run migrations
│   └── backup/
│       └── .gitkeep               # 📁 Placeholder for database backups
│
├── .env                            # 🔐 Environment variables (DO NOT COMMIT TO GIT)
├── .env.example                    # 📋 Template for required environment variables
├── .gitignore                     # 🚫 Git ignore rules
├── docker-compose.yml             # 🐳 PostgreSQL database container setup
├── package.json                   # 📦 Root-level npm scripts for full-stack commands
└── README.md                      # 📚 Project documentation