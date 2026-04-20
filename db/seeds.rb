Card.destroy_all
BoardEvent.destroy_all

cards = [
  { title: "Set up project structure", description: "Initialize the repository and configure basic tooling", column: 4, position: 10 },
  { title: "Design database schema", description: "Create ERD and define table relationships", column: 4, position: 20 },
  { title: "Implement authentication", description: "Add user login and registration", column: 3, position: 10 },
  { title: "Create API endpoints", description: "Build REST API for cards and events", column: 2, position: 10 },
  { title: "Build Kanban board UI", description: "Implement drag-and-drop functionality", column: 2, position: 20 },
  { title: "Add time-travel feature", description: "Implement timeline slider and state reconstruction", column: 1, position: 10 },
  { title: "Write documentation", description: "Create README and API docs", column: 0, position: 10 },
  { title: "Performance optimization", description: "Improve query performance and add caching", column: 0, position: 20 },
  { title: "Security audit", description: "Review code for security vulnerabilities", column: 0, position: 30 },
]

cards.each do |card_attrs|
  card = Card.create!(card_attrs)
  sleep 0.1
end

puts "Created #{Card.count} cards with events"
