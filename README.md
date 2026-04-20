# Kanban Board with Time-Travel

A single-board Kanban application with a time-travel feature. Users can create, edit, and reorder cards, and at any moment scrub a timeline to view the exact state of the board at any point in the past.

## Requirements

- **Ruby**: 3.3.x (latest stable)
- **Node.js**: 18.x or 20.x
- **PostgreSQL**: 14.x or higher
- **Bundler**: 2.x

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
unzip kanban_board.zip
cd kanban_board

# Install Ruby dependencies
bundle install

# Install Node.js dependencies
npm install
```

### 2. Database Setup

Ensure PostgreSQL is running, then:

```bash
# Create the database
bin/rails db:create

# Run migrations
bin/rails db:migrate

# (Optional) Seed with sample data
bin/rails db:seed
```

### 3. Run the Application

```bash
# Build assets (CSS + JS)
npm run build

# Start the server (in separate terminal)
bin/rails server
```

The application will be available at `http://localhost:3000`.

## Build Commands

```bash
npm run build       # Build CSS + JS, copy to public/assets
npm run build:js   # Build JS only
npm run build:css    # Build CSS only
```

## Architecture Overview

### Card State Storage

Cards are stored in a `cards` table:

| Column     | Type     | Description                              |
|------------|----------|------------------------------------------|
| id         | integer  | Primary key                             |
| title      | string   | Card title (required)                    |
| description| text     | Card description (optional)              |
| column     | integer  | Column index (0-4)                      |
| position   | float    | Fractional position within the column    |

**Position Strategy**: Uses floating-point positions (10, 20, 30...). Algorithm:
- **Empty column**: position = 10
- **Drop at top**: `first.position - 10` (min: 1)
- **Drop at bottom**: `last.position + 10`
- **Drop in middle**: `(before.position + after.position) / 2`

Safeguards:
- `Math.max(1, newPosition)` prevents negative positions
- New cards: `max_position + 10` (adds at bottom)

### Historical Events Storage

Every change is recorded in `board_events` using event-sourcing:

| Column        | Type     | Description                              |
|---------------|----------|------------------------------------------|
| id            | integer  | Primary key                             |
| event_type    | string   | created, updated, moved, deleted         |
| card_id       | integer  | Reference to the card                    |
| card_title    | string   | Snapshot of card title                    |
| from_column   | integer  | Previous column (for moves)               |
| to_column     | integer  | New column (for creates/moves)           |
| from_position | float    | Previous position (for moves)           |
| to_position   | float    | New position (for creates/moves)       |
| metadata      | json     | Additional data (e.g., description)       |
| created_at    | timestamp| When the event occurred                |

### State Reconstruction

To reconstruct the board at any past timestamp:

1. Query all events where `created_at <= timestamp`
2. Replay events in chronological order
3. Merge with current card descriptions

### Assets

- **CSS**: Built with Tailwind CLI via npm
- **JS**: Bundled with esbuild
- Files served from `public/assets/`

## Features

### Core Board Functionality

- Create cards with title and optional description
- Edit card title and description  
- Drag-and-drop cards between columns
- Drag-and-drop to reorder cards within a column
- Delete cards

### Time-Travel

- Timeline slider to view the board at any past moment
- Clear visual indicator when in historical view mode
- Read-only when viewing past state
- Return to live view with one click

### Activity Log

- Activity feed showing recent events
- Human-readable descriptions (e.g., "Card 'Fix bug' moved from To Do to In Progress")
- Manual refresh option

## Technology Stack

- **Backend**: Ruby on Rails 8.x
- **Frontend**: React 18 with esbuild bundling
- **Styling**: Tailwind CSS (CLI-built)
- **Database**: PostgreSQL
- **Drag-and-Drop**: @hello-pangea/dnd
- **Date Formatting**: date-fns
- **JS Bundling**: esbuild


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cards` | Create new card |
| PATCH | `/cards/:id` | Update card |
| DELETE | `/cards/:id` | Delete card |
| POST | `/cards/:id/move` | Move/reorder card (also handles reorder) |
| GET | `/board/history` | Get board state at timestamp |
| GET | `/board/events` | Get recent activity |
| GET | `/board/time_range` | Get earliest/latest timestamps |
