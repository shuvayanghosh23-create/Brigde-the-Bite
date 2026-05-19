
# BridgeTheBite Web Platform UI

BridgeTheBite is a role-based web platform that connects **restaurants with surplus food** to **nearby NGOs** so food reaches beneficiaries instead of being wasted.

Original design source:  
https://www.figma.com/design/zstBLbPbVAyP2eYX29XTit/BridgeTheBite-Web-Platform-UI

## Problem It Solves

The platform targets two issues at the same time:
- food waste at restaurants/hotels
- hunger and meal shortages for vulnerable communities

It solves this by enabling quick, local, trackable donation flow:
1. Restaurant lists surplus food with expiry and pickup details.
2. NGO discovers and accepts available donation.
3. Pickup and completion are tracked, with proof and notifications.
4. Admin gets visibility through user, donation, support, and analytics views.

## Website Architecture

### 1) Frontend Stack
- **React + TypeScript**
- **Vite** for development/build
- **React Router** for route-based pages
- **Tailwind + UI component set** for interface consistency
- **Motion/Recharts/Lucide** for animations, charts, and icons

### 2) App Structure
- `src/main.tsx` → app bootstrap
- `src/app/App.tsx` → provider wiring + initial data seeding
- `src/app/routes.tsx` → all public + role routes
- `src/app/pages/**` → page modules by role (`restaurant`, `ngo`, `admin`)
- `src/app/components/**` → shared layout and UI components
- `src/app/contexts/**` → auth and notifications state management
- `src/app/utils/storage.ts` → LocalStorage persistence layer
- `src/app/data/mockData.ts` → seeded demo users, donations, chats, notifications, tickets, ratings

### 3) Role-Based Architecture
- **Restaurant portal**: donation creation, tracking, chat, ratings, history
- **NGO portal**: browse/accept donations, request tracking, completion proof, chat
- **Admin portal**: user oversight, donation monitoring, support handling, analytics

Each role has dedicated routes and dashboard navigation, but shares common providers/components.

### 4) Data + State Architecture
- Persistent browser storage via `localStorage` keys for users, donations, chats, notifications, support tickets, ratings
- Initialization layer seeds storage once from mock data
- Context providers:
  - `AuthContext`: login/signup/session/password/account operations
  - `NotificationContext`: user-scoped notifications, unread count, read state

## Special Things This Platform Has

- **Hyper-local 5 km discovery logic** in map and matching experience
- **End-to-end donation lifecycle tracking** (`pending → accepted → completed/cancelled`)
- **Completion proof upload** by NGO during delivery confirmation
- **Built-in cross-role notification system** (restaurant, NGO, admin)
- **Two-way collaboration trust features** (chat + ratings + history trail)
- **Role-specific dashboards** with analytics and operational visibility

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
  
