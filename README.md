# JustSploit - Penetration Testing Platform

JustSploit is a comprehensive penetration testing and security assessment platform that combines powerful reconnaissance tools, exploit frameworks, and AI assistance to streamline security testing workflows.

## Features

### 🔍 Reconnaissance
- **Nmap Integration**: Advanced port scanning and service detection
- **WhatWeb Scanning**: Web technology fingerprinting
- **Custom Scan Types**: Basic, stealth, aggressive, and port-only scans
- **Real-time Results**: Live scan output with progress tracking

### 💥 Exploitation
- **Metasploit Integration**: Full MSF RPC integration
- **Module Management**: Browse and execute exploit modules
- **Session Management**: Interactive shell and meterpreter sessions
- **Auxiliary Tools**: Vulnerability scanners and information gathering

### 🤖 AI Assistant
- **Intelligent Analysis**: AI-powered scan result interpretation
- **Vulnerability Assessment**: Automated risk analysis and recommendations
- **Exploit Suggestions**: AI-driven exploit recommendations
- **Report Generation**: Automated penetration testing reports
- **Real-time Chat**: Interactive security consultation

### 📊 Project Management
- **Multi-project Support**: Organize assessments by project
- **Target Management**: Add and manage multiple targets per project
- **Scan History**: Track all reconnaissance activities
- **Result Storage**: Persistent scan results and findings

### 🎨 Modern UI
- **Dark Theme**: Professional dark interface
- **Real-time Terminal**: Live command output display
- **Responsive Design**: Works on desktop and mobile
- **Interactive Components**: Modern React-based interface

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Tools         │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - API Routes    │    │ - Nmap          │
│ - Project View  │    │ - Services      │    │ - WhatWeb       │
│ - AI Assistant  │    │ - Models        │    │ - Metasploit    │
│ - Terminal      │    │ - Celery Tasks  │    │ - OpenAI        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (PostgreSQL)  │
                       │                 │
                       │ - Projects      │
                       │ - Targets       │
                       │ - Scan Results  │
                       │ - Users         │
                       └─────────────────┘
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Nmap (for reconnaissance)
- WhatWeb (for web scanning)
- Metasploit Framework (for exploitation)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/justsploit.git
   cd justsploit
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cp backend/.env.example backend/.env
   
   # Edit the .env file with your configuration
   nano backend/.env
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Default Credentials

- **Admin User**: `admin` / `admin123`
- **Demo User**: `demo` / `demo123`

## Usage

### 1. Create a Project

1. Navigate to the Dashboard
2. Click "New Project"
3. Fill in project details (name, description, scope)
4. Add targets (IP addresses, domains, URLs)

### 2. Run Reconnaissance

1. Select your project
2. Choose scan type (Nmap, WhatWeb)
3. Configure scan parameters
4. Start the scan
5. Monitor real-time progress in the terminal

### 3. Analyze Results

1. View scan results in the project dashboard
2. Use AI Assistant to analyze findings
3. Get vulnerability assessments and recommendations
4. Generate detailed reports

### 4. Execute Exploits

1. Browse available Metasploit modules
2. Configure exploit parameters
3. Execute against vulnerable targets
4. Manage active sessions

## API Documentation

The backend provides a comprehensive REST API:

- **Authentication**: JWT-based authentication
- **Projects**: CRUD operations for project management
- **Reconnaissance**: Scan execution and result retrieval
- **Exploitation**: Metasploit module management and execution
- **AI Assistant**: Chat and analysis endpoints

Full API documentation is available at `http://localhost:8000/docs`

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
cd backend
python -m app.db.init_db
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./justsploit.db` |
| `SECRET_KEY` | JWT secret key | `your-secret-key` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | None |
| `MSF_HOST` | Metasploit RPC host | `localhost` |
| `MSF_PORT` | Metasploit RPC port | `55553` |
| `NMAP_PATH` | Path to Nmap executable | `/usr/bin/nmap` |
| `WHATWEB_PATH` | Path to WhatWeb executable | `/usr/bin/whatweb` |

### Security Considerations

- Change default passwords immediately
- Use strong SECRET_KEY in production
- Configure proper CORS settings
- Enable HTTPS in production
- Regularly update dependencies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is designed for authorized security testing and penetration testing only. Users are responsible for ensuring they have proper authorization before testing any systems. The authors are not responsible for any misuse of this software.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/justsploit/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/justsploit/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/justsploit/discussions)

## Roadmap

- [ ] Web application vulnerability scanning
- [ ] Custom exploit development framework
- [ ] Integration with additional security tools
- [ ] Advanced reporting and compliance features
- [ ] Team collaboration features
- [ ] Mobile application
- [ ] API rate limiting and monitoring
- [ ] Advanced AI capabilities

---

**JustSploit** - Making penetration testing more efficient and accessible. 