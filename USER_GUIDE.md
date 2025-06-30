# User Guide

This guide will help you get the most out of the Ontology Management Application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Authentication](#user-authentication)
3. [Profile Management](#profile-management)
4. [Creating Ontologies](#creating-ontologies)
5. [Editing Ontologies](#editing-ontologies)
6. [Database Integration](#database-integration)
7. [Collaboration Features](#collaboration-features)
8. [Advanced Features](#advanced-features)

## Getting Started

### First Time Login

1. **Access the Application**
   - Open your web browser
   - Navigate to the application URL
   - You'll see the login screen

2. **Create an Account**
   - Click "Sign up" if you don't have an account
   - Fill in your details:
     - Full Name
     - Email Address
     - Password (minimum 6 characters)
   - Click "Create Account"

3. **Alternative: Google Sign-In**
   - Click "Sign in with Google"
   - Choose your Google account
   - Grant necessary permissions

## User Authentication

### Sign In Options

**Email/Password**
- Enter your registered email and password
- Click "Sign In"

**Google OAuth**
- Click "Sign in with Google"
- Select your Google account
- Automatic account creation for new users

**Password Reset**
- Click "Forgot your password?"
- Enter your email address
- Check your email for reset instructions

### Account Security

- Use strong passwords (8+ characters, mixed case, numbers, symbols)
- Enable two-factor authentication in your Google account if using Google Sign-In
- Log out from shared devices

## Profile Management

### Accessing Your Profile

- Click your profile picture/name in the top right
- Or click "My Profile" from the navigation menu

### Profile Features

**Personal Information**
- View and edit your name
- Email address (read-only)
- Profile picture (if using Google Sign-In)

**Account Statistics**
- Number of ontologies created
- Member since date
- Recent activity

**Quick Actions**
- Create new ontology
- Import ontology files
- Export all ontologies

### Account Settings

Click the settings icon (⚙️) to access:

**Profile Tab**
- Update your full name
- Change profile picture
- View account information

**Password Tab** (for email/password accounts)
- Change your password
- Requires current password for security

## Creating Ontologies

### Starting a New Ontology

1. **From Profile Page**
   - Click "Create New Ontology" button
   - Or click the "+" icon in the navigation

2. **New Ontology Interface**
   - **Left Panel**: Import and Mix options
   - **Center Panel**: Visual editor
   - **Right Panel**: Ontology details

### Import Methods

**File Upload**
- Drag and drop files into the import area
- Supported formats: CSV, TXT, OWL, RDF
- Files are automatically processed

**Ontology Mixing**
- Search existing ontologies
- Select ontologies to combine
- Preview merged structure

### Visual Editor

**Adding Nodes**
- Click the "+" button in the toolbar
- Click on the canvas to place nodes
- Double-click nodes to edit properties

**Creating Relationships**
- Click the link button (🔗) in the toolbar
- Click source node, then target node
- Define relationship type and properties

**Editing Elements**
- Single-click to select
- Double-click to edit
- Right-click for context menu
- Drag to reposition

### Ontology Details

**Required Information**
- **Title**: Descriptive name for your ontology
- **Description**: Detailed explanation of purpose and scope
- **Tags**: Comma-separated keywords for categorization

**Actions**
- **Save**: Save as draft
- **Publish**: Make available for use and sharing

## Editing Ontologies

### Accessing Edit Mode

1. From your profile, click "Edit" on any ontology card
2. Or from ontology details view, click "EDIT" button

### Edit Interface

**Toolbar Functions**
- **Undo** (↶): Reverse last action
- **Add Node** (+): Create new concept
- **Link Nodes** (🔗): Create relationships

**Modification Options**
- Add new concepts and relationships
- Import additional data
- Mix with other ontologies
- Update metadata

### Collaborative Editing

**Comments System**
- View comments from collaborators
- Add your own comments
- Reply to existing discussions
- Upload supporting files

**Version Control**
- Changes are automatically saved
- View edit history
- Revert to previous versions

## Database Integration

### Connecting to Neo4j

1. **Go to "Use Ontology" View**
   - Select from navigation menu

2. **Database Connection**
   - Enter connection details:
     - URI (e.g., `bolt://localhost:7687`)
     - Username (usually `neo4j`)
     - Password
   - Or upload credentials file

3. **Test Connection**
   - Click "CONNECT"
   - Wait for confirmation
   - View database statistics

### Working with Connected Databases

**Data Visualization**
- View live data from your Neo4j database
- Interactive graph exploration
- Node and relationship details

**Query Console**
- Execute Cypher queries
- Common queries provided
- Export query results

**Data Upload**
- Select an ontology from your collection
- Click "UPLOAD" to push to database
- Monitor upload progress

### Query Examples

**Basic Queries**
```cypher
// View all nodes
MATCH (n) RETURN n LIMIT 25

// View all relationships
MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 25

// Find specific node types
MATCH (n:Person) RETURN n
```

**Advanced Queries**
```cypher
// Find shortest path
MATCH path = shortestPath((a:Person)-[*]-(b:Person))
WHERE a.name = 'Alice' AND b.name = 'Bob'
RETURN path

// Analyze relationships
MATCH (n)-[r]->(m)
RETURN type(r) as relationship, count(*) as count
ORDER BY count DESC
```

## Collaboration Features

### Sharing Ontologies

**Public Sharing**
- Published ontologies are visible to all users
- Others can view and fork your work
- Maintain attribution and version history

**Team Collaboration**
- Add comments to ontologies
- Discuss changes and improvements
- Share feedback and suggestions

### Comment System

**Adding Comments**
- Navigate to ontology details
- Scroll to comments section
- Type your comment and click "Post"

**Comment Features**
- View all comments chronologically
- See author and timestamp
- Include links and references

### Forking Ontologies

**When to Fork**
- Want to modify someone else's ontology
- Create variations for different use cases
- Experiment with changes safely

**How to Fork**
1. View any ontology details
2. Click "FORK" button
3. Ontology is copied to your account
4. Make modifications as needed

## Advanced Features

### File Format Support

**Import Formats**
- **CSV**: Tabular data with headers
- **TXT**: Plain text with structured data
- **OWL**: Web Ontology Language files
- **RDF**: Resource Description Framework

**Export Options**
- JSON format for programmatic use
- CSV for spreadsheet applications
- OWL for semantic web applications

### Search and Discovery

**Finding Ontologies**
- Use search bar in profile view
- Filter by tags and categories
- Browse recently modified
- Explore public ontologies

**Search Tips**
- Use specific keywords
- Try tag-based filtering
- Check related ontologies
- Look at popular/trending items

### Performance Optimization

**Large Ontologies**
- Use pagination for large datasets
- Limit visualization complexity
- Consider breaking into smaller modules
- Use database queries for analysis

**Best Practices**
- Regular saves during editing
- Meaningful naming conventions
- Comprehensive descriptions
- Appropriate tagging

## Troubleshooting

### Common Issues

**Login Problems**
- Check email/password spelling
- Try password reset if needed
- Clear browser cache
- Check internet connection

**File Upload Issues**
- Verify file format is supported
- Check file size limits
- Ensure file is not corrupted
- Try different browser

**Database Connection**
- Verify Neo4j is running
- Check connection credentials
- Test network connectivity
- Review firewall settings

### Getting Help

**In-App Support**
- Check tooltips and help text
- Use the comment system for questions
- Look for error messages and guidance

**External Resources**
- GitHub Issues for bug reports
- Documentation for detailed guides
- Community forums for discussions

## Tips for Success

### Ontology Design

1. **Start Simple**: Begin with core concepts
2. **Be Consistent**: Use standard naming conventions
3. **Document Well**: Add descriptions and examples
4. **Test Regularly**: Validate with real data
5. **Iterate**: Refine based on feedback

### Collaboration

1. **Communicate Clearly**: Use descriptive comments
2. **Respect Others**: Give credit and attribution
3. **Share Knowledge**: Help others learn
4. **Stay Organized**: Use tags and categories

### Technical Best Practices

1. **Regular Backups**: Export important ontologies
2. **Version Control**: Save major milestones
3. **Performance**: Monitor large ontology performance
4. **Security**: Use strong passwords and secure connections

---

For more detailed technical information, see the [README.md](README.md) and [API Documentation](API.md).