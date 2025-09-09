# FSH Funds

A comprehensive fundraising management platform designed for nonprofits and charitable organizations. FSH Funds provides tools for donor management, fundraising campaigns, event management, email marketing, and analytics.

## 🚀 Features

### Donor Management
- **Contact Records**: Complete donor profiles with contact information, addresses, and preferences
- **Gift History**: Track all donations with detailed transaction information
- **Communication Tracking**: Log all interactions (emails, calls, meetings, events)
- **Donor Segmentation**: Categorize donors with tags and custom segments
- **Duplicate Detection**: Automatically identify and merge duplicate donor records
- **Privacy Controls**: Respect donor preferences (do not email, call, or mail)

### Fundraising Campaigns
- **Public Donation Pages**: Customizable, mobile-responsive donation pages
- **Campaign Management**: Set goals, track progress, and manage campaign lifecycles
- **Multiple Payment Methods**: Support for credit cards, ACH, checks, and other payment types
- **Recurring Donations**: Set up and manage recurring gift programs
- **Anonymous Donations**: Support for anonymous giving with tribute options
- **Real-time Analytics**: Track campaign performance, conversion rates, and donor engagement

### Event Management
- **Event Creation**: Comprehensive event setup with dates, locations, and descriptions
- **Ticketing System**: Multiple ticket types with pricing tiers and early bird discounts
- **Registration Management**: Handle attendee registrations with custom forms
- **Payment Processing**: Integrated payment processing for event tickets
- **Check-in System**: Digital check-in for event day management
- **Virtual Events**: Support for online events with meeting links
- **Event Analytics**: Track registrations, revenue, and attendee engagement

### Email Marketing
- **Microsoft Graph Integration**: Professional email sending with high deliverability
- **Email Templates**: Pre-designed templates for thank you notes, receipts, and campaigns
- **Campaign Management**: Design, schedule, and send email campaigns
- **Audience Segmentation**: Target specific donor groups with personalized messaging
- **A/B Testing**: Test different subject lines and content variations
- **Delivery Tracking**: Monitor open rates, click rates, and engagement metrics
- **Automated Workflows**: Set up triggered emails based on donor actions

### Bulk Operations
- **Data Import**: Import donors, gifts, and events from CSV/Excel files
- **Data Export**: Export data in multiple formats (CSV, Excel, PDF)
- **Data Validation**: Comprehensive validation with error reporting
- **Progress Tracking**: Real-time progress updates for large operations
- **Duplicate Prevention**: Skip duplicates during import processes
- **Backup & Restore**: Regular data backups with restore capabilities

### Analytics & Reporting
- **Dashboard**: Real-time overview of key fundraising metrics
- **Donor Analytics**: Lifetime value, retention rates, and giving patterns
- **Campaign Performance**: ROI analysis, conversion tracking, and goal progress
- **Event Metrics**: Registration trends, revenue analysis, and attendee insights
- **Email Performance**: Delivery rates, engagement metrics, and campaign effectiveness
- **Custom Reports**: Generate detailed reports for board meetings and stakeholders

## 🏗️ Architecture

### Backend (Python/FastAPI)
```
backend/
├── models/              # SQLAlchemy database models
│   ├── donors/          # Donor, gift, and communication models
│   ├── campaigns/       # Campaign and analytics models
│   ├── events/          # Event, ticket, and registration models
│   ├── email/           # Email templates, campaigns, and logs
│   └── bulk/           # Import/export job models
├── api/                # FastAPI route handlers
├── repositories/       # Data access layer
├── services/          # Business logic layer
└── tests/             # Unit and integration tests
```

### Frontend (React/TypeScript)
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route-specific page components
│   ├── services/      # API service layer
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions and formatters
│   ├── contexts/      # React contexts for state management
│   └── types/         # TypeScript type definitions
```

## 🔄 Key Workflows

### Donor Onboarding Workflow
1. **Data Import** → Import existing donor data from spreadsheets or other systems
2. **Duplicate Detection** → System identifies potential duplicates for review
3. **Data Cleaning** → Staff reviews and merges duplicate records
4. **Profile Creation** → Complete donor profiles with full contact information
5. **Segmentation** → Assign tags and categories for targeted outreach

### Donation Processing Workflow
1. **Online Donation** → Donor visits public campaign page
2. **Payment Processing** → Secure payment collection via integrated gateway
3. **Receipt Generation** → Automatic email receipt with tax information
4. **Data Recording** → Gift recorded in donor's profile with full details
5. **Thank You Process** → Personalized thank you message sent
6. **Follow-up Scheduling** → System schedules appropriate follow-up actions

### Campaign Management Workflow
1. **Campaign Creation** → Set up campaign with goals, messaging, and branding
2. **Page Customization** → Design public donation page with images and content
3. **Launch & Promotion** → Publish page and begin marketing efforts
4. **Performance Monitoring** → Track donations, traffic, and conversion rates
5. **Optimization** → Adjust messaging and strategies based on performance data
6. **Campaign Closure** → Final reporting and donor stewardship

### Event Management Workflow
1. **Event Planning** → Create event with details, location, and ticket types
2. **Registration Setup** → Configure registration forms and payment processing
3. **Marketing Launch** → Promote event through email campaigns and social media
4. **Registration Management** → Track registrations and process payments
5. **Pre-Event Communication** → Send reminders and event details to attendees
6. **Event Day** → Check-in attendees and manage event logistics
7. **Post-Event Follow-up** → Thank attendees and process feedback

### Email Marketing Workflow
1. **Audience Segmentation** → Define target audience based on donor attributes
2. **Content Creation** → Design email using templates or custom content
3. **A/B Testing** → Test different versions with small audience samples
4. **Campaign Scheduling** → Schedule optimal send times for maximum engagement
5. **Delivery & Monitoring** → Send emails and track delivery metrics
6. **Performance Analysis** → Analyze open rates, clicks, and conversions
7. **Follow-up Actions** → Schedule follow-up based on engagement data

### Data Management Workflow
1. **Regular Backups** → Automated daily backups of all system data
2. **Data Validation** → Continuous monitoring for data quality issues
3. **Duplicate Monitoring** → Regular scans for potential duplicate records
4. **Performance Optimization** → Database optimization and query tuning
5. **Compliance Checking** → Ensure GDPR and privacy regulation compliance
6. **Audit Logging** → Track all data changes for security and compliance

## 🛠️ Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+
- Redis (for caching and background jobs)

### Backend Setup
```bash
cd backend/
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install poetry
poetry install
cp .env.example .env
# Configure your database settings in .env
alembic upgrade head
python local_dev.py
```

### Frontend Setup
```bash
cd frontend/
npm install
cp .env.example .env.local
# Configure your API endpoints in .env.local
npm run dev
```

## 📊 Technical Specifications

### Database
- **Primary**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for session management and background jobs
- **Search**: Full-text search capabilities for donor and campaign data

### Security
- **Authentication**: JWT tokens with refresh token rotation
- **Authorization**: Role-based access control (Admin, Staff, Volunteer)
- **Data Protection**: Encryption at rest and in transit
- **Privacy**: GDPR-compliant data handling and retention policies

### Performance
- **API**: FastAPI with async/await for high concurrency
- **Frontend**: React with code splitting and lazy loading
- **Database**: Optimized queries with proper indexing
- **Caching**: Redis caching for frequently accessed data

### Integration APIs
- **Payment Processing**: Stripe, Square, PayPal integrations
- **Email Delivery**: Microsoft Graph API, SendGrid backup
- **Analytics**: Google Analytics, custom event tracking
- **Third-party**: Webhooks for CRM and accounting system integrations

## 📈 Roadmap

### Phase 1: Core Platform (Q1 2024)
- Complete donor management system
- Basic campaign functionality
- Payment processing integration
- Email system setup

### Phase 2: Advanced Features (Q2 2024)
- Event management system
- Advanced analytics and reporting
- Mobile app development
- API integrations

### Phase 3: Enterprise Features (Q3 2024)
- Multi-organization support
- Advanced security features
- White-label customization
- Enterprise integrations

### Phase 4: AI & Automation (Q4 2024)
- Predictive analytics for donor behavior
- Automated campaign optimization
- AI-powered email content suggestions
- Smart donor segmentation

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@fshfunds.com
- Documentation: [docs.fshfunds.com](https://docs.fshfunds.com)
- Community Forum: [community.fshfunds.com](https://community.fshfunds.com)

---

**FSH Funds** - Empowering nonprofits to maximize their fundraising potential through technology.
