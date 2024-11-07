-- Table: users
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,            -- Storing user_id as string generated from external logic (e.g., from Node.js)
    email TEXT UNIQUE NOT NULL,          -- Email must be unique and non-null
    password_hash TEXT NOT NULL,         -- Password hash for secure storage
    first_name TEXT,                     -- Optional first name field
    last_name TEXT,                      -- Optional last name field
    created_at TEXT NOT NULL             -- Timestamp as TEXT
);

-- Table: ai_tools (AI Tools Directory)
CREATE TABLE ai_tools (
    tool_id TEXT PRIMARY KEY,            -- Tool ID as string generated externally
    name TEXT UNIQUE NOT NULL,           -- Tool name must be unique
    description TEXT NOT NULL,           -- Brief description of the tool
    capabilities TEXT NOT NULL,          -- List of capabilities this AI tool provides (e.g., Generation, Summarization)
    outputs TEXT,                        -- List of outputs the AI generates (e.g., Blog posts, Presentations)
    pricing TEXT NOT NULL,               -- Pricing information (e.g., Free, Freemium)
    ease_of_use INT NOT NULL,            -- Integer rating for ease of use from 1 to 5
    tags TEXT NOT NULL,                  -- Tags for searching/filtering (comma-separated)
    example_usage TEXT,                  -- Example use case of the tool
    created_at TEXT NOT NULL             -- Timestamp as TEXT
);

-- Table: workflows (User-created workflows or predefined templates)
CREATE TABLE workflows (
    workflow_id TEXT PRIMARY KEY,        -- Workflow ID as string generated externally
    user_id TEXT REFERENCES users(user_id), -- Optional foreign key link to users
    title TEXT NOT NULL,                 -- Title of the workflow
    category TEXT NOT NULL,              -- E.g. Sales, Marketing, Video Production
    description TEXT,                    -- Optional description for what this workflow achieves
    is_predefined BOOLEAN NOT NULL,      -- Boolean flag indicating if it's predefined or user-generated
    created_at TEXT NOT NULL             -- Timestamp as TEXT
);

-- Table: workflow_nodes (Each step of a workflow)
CREATE TABLE workflow_nodes (
    node_id TEXT PRIMARY KEY,            -- Node ID as string generated externally
    workflow_id TEXT NOT NULL REFERENCES workflows(workflow_id), -- Foreign key referencing a workflow
    title TEXT NOT NULL,                 -- Node step title (e.g., Research Clients, Write Email)
    description TEXT,                    -- Optional description of the workflow step
    connected_nodes TEXT,                -- Comma-separated list of node IDs this node is connected to
    created_at TEXT NOT NULL             -- Timestamp as TEXT
);

-- Table: ai_tool_node_suggestions (AI tool recommendations for workflow nodes)
CREATE TABLE ai_tool_node_suggestions (
    suggestion_id TEXT PRIMARY KEY,      -- Suggestion ID generated externally
    node_id TEXT NOT NULL REFERENCES workflow_nodes(node_id), -- Foreign key referencing a specific workflow node
    tool_id TEXT NOT NULL REFERENCES ai_tools(tool_id),       -- Foreign key referencing an AI tool
    rank INT NOT NULL                    -- Rank of the AI tool suggestion (e.g., 1=Top Suggestion)
);

-- ----------------------------------------------------
-- Seeding the database with some sample entries
-- ----------------------------------------------------

-- Insert users
INSERT INTO users (user_id, email, password_hash, first_name, last_name, created_at) VALUES
('1', 'alice@example.com', '$2b$12$abcdef...', 'Alice', 'Johnson', '2023-11-01 12:00:00'),
('2', 'bob@example.com', '$2b$12$uvwxyz...', 'Bob', 'Smith', '2023-11-02 14:00:00');

-- Insert AI tools
INSERT INTO ai_tools (tool_id, name, description, capabilities, outputs, pricing, ease_of_use, tags, example_usage, created_at) VALUES
('1', 'ChatGPT', 'AI for generating human-like text', 'Text generation', 'Blog posts, Emails', 'Free Plan', 4, 'sales, writing', 'Auto-generate outreach emails', '2023-11-01 12:00:00'),
('2', 'Gamma', 'AI for creating presentations from text input', 'Presentation creation', 'PowerPoint slides', 'Subscription', 5, 'presentations', 'Generate slide decks from a few bullet points', '2023-11-02 14:00:00');

-- Insert workflows
INSERT INTO workflows (workflow_id, user_id, title, category, description, is_predefined, created_at) VALUES
('1', '1', 'Sales Outreach Workflow', 'Sales', 'Helps sales teams contact prospects', FALSE, '2023-11-01 13:00:00'),
('2', NULL, 'Default Video Production Workflow', 'Video', 'Base workflow for video production', TRUE, '2023-11-01 12:05:00');

-- Insert workflow nodes
INSERT INTO workflow_nodes (node_id, workflow_id, title, description, connected_nodes, created_at) VALUES
('1', '1', 'Research Prospects', 'Research key potential clients', '2', '2023-11-01 14:00:00'),
('2', '1', 'Write Sales Email', 'Create a personalized email', '1,3', '2023-11-01 15:00:00'),
('3', '2', 'Shoot the First Video Scene', NULL, '', '2023-11-02 10:00:00');

-- Insert AI Tool Suggestions for workflow nodes
INSERT INTO ai_tool_node_suggestions (suggestion_id, node_id, tool_id, rank) VALUES
('1', '1', '1', 1),
('2', '1', '2', 2),
('3', '2', '1', 1),
('4', '2', '2', 2);

-- ----------------------------------------------------
-- Done seeding
-- ----------------------------------------------------