# FreshFlow - B2B Import Management Platform

פלטפורמה לניהול ייבוא B2B למוצרים חקלאיים.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React + TypeScript, Tailwind CSS, shadcn/ui, React Query, Zod, i18n
- **Backend:** NestJS (TypeScript), Prisma ORM, PostgreSQL, BullMQ + Redis, S3 (MinIO), Resend
- **Auth:** JWT עם roles (OWNER, STAFF, SUPPLIER) ו-tenant isolation
- **Infra:** Docker Compose, pnpm workspaces

## התקנה

```bash
# התקנת dependencies
pnpm install

# הגדרת environment variables
cp .env.example .env
# ערוך את .env עם הערכים הנכונים

# הפעלת Docker Compose
docker-compose up -d

# הרצת migrations
pnpm --filter @rachel/backend db:migrate

# Seed database
pnpm --filter @rachel/backend db:seed

# הפעלת backend
pnpm dev:backend

# הפעלת frontend (בטרמינל אחר)
pnpm dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rachel
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=rachel-documents
S3_REGION=us-east-1
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## מבנה הפרויקט

```
├── apps/
│   ├── frontend/          # Next.js frontend
│   └── backend/           # NestJS backend
├── packages/
│   ├── database/          # Prisma schema & migrations
│   └── shared/            # Shared utilities
└── docker-compose.yml     # Docker services
```

## API Endpoints

- `POST /auth/login` - התחברות
- `GET /suppliers` - רשימת ספקים
- `GET /categories` - קטגוריות
- `POST /rfq` - יצירת RFQ
- `POST /quotes` - יצירת הצעת מחיר
- `POST /po/from-quote/:quoteId` - יצירת PO מהצעת מחיר
- `POST /invoices` - יצירת חשבונית
- `POST /shipments` - יצירת משלוח
- `POST /landed-cost/calculate` - חישוב עלות סופית
- `GET /tariff` - שיעורי מכס

## Workflows

1. **RFQ → Quote → PO**
   - Buyer יוצר RFQ
   - Supplier שולח Quote
   - Buyer מאשר Quote ויוצר PO

2. **PO → Invoice → Payment**
   - Supplier מעלה Invoice
   - Buyer מאשר Invoice
   - Buyer מעלה Payment Instruction
   - Supplier מאשר תשלום

3. **Shipments & Containers**
   - יצירת משלוח עם containers
   - מעקב אחר מצב משלוח
   - ניהול reefer parameters

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

## Deployment

### Production
- Frontend: Vercel
- Backend: Railway/Render
- Database: PostgreSQL (managed)
- Redis: Upstash/Redis Cloud
- S3: AWS S3

ראה `.env.example` לפרטים נוספים.

## License

Private

