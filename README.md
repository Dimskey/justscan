# 🔐 JustSploit - Penetration Testing Platform

Modern web-based platform for ethical hacking and security assessment with AI-powered analysis.

## 🚀 Features

### 🔍 Network Reconnaissance
- **Nmap Integration**: Advanced port scanning and service detection
- **WhatWeb Scanning**: Web technology fingerprinting and identification
- **Custom Scan Types**: Basic, stealth, aggressive, and port-specific scans
- **Real-time Results**: Live scan output with progress tracking
- **Scan History**: Persistent storage of all scan results

### 🤖 AI Assistant (IBM Granite)
- **Intelligent Analysis**: AI-powered scan result interpretation using IBM Granite models
- **Vulnerability Assessment**: Automated risk analysis and security recommendations
- **Technology Insights**: Smart analysis of discovered web technologies
- **Interactive Chat**: Real-time security consultation and guidance
- **Result Interpretation**: Convert raw scan data into actionable insights

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

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ - Dashboard     │    │ - API Routes    │    │ - Nmap          │
│ - Project View  │    │ - Scan Services │    │ - WhatWeb       │
│ - AI Assistant  │    │ - Task Queue    │    │ - IBM Granite   │
│ - Scan Terminal │    │ - Database ORM  │    │ - Replicate API │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (PostgreSQL)  │
                       │                 │
                       │ - Projects      │
                       │ - Scan Results  │
                       │ - Notes         │
                       │ - Users         │
                       └─────────────────┘
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- Replicate API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/justsploit.git
   cd justsploit
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit with your configuration
   nano .env
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🌐 Deployment

### Production Stack
- **Frontend**: Vercel (Static hosting)
- **Backend**: Railway (Container hosting)
- **Database**: PostgreSQL (Railway/Supabase)
- **AI**: IBM Granite via Replicate API

## Usage

### 1. Create a Project

1. Navigate to the Dashboard
2. Click "New Project"
3. Fill in project details (name, description, scope)
4. Add targets (IP addresses, domains, URLs)

### 2. Run Reconnaissance

1. Select your project
2. Choose scan type (Nmap for ports, WhatWeb for web tech)
3. Configure scan parameters and target
4. Start the scan and monitor real-time progress
5. View results in scan history

### 3. Analyze with AI

1. View scan results in the project dashboard
2. Use AI Assistant powered by IBM Granite
3. Get intelligent analysis of discovered technologies
4. Receive security recommendations and insights
5. Ask questions about scan findings

### 4. Manage Projects

1. Organize multiple security assessments
2. Track scan history per project  
3. Add notes and documentation
4. Export findings and reports

## API Documentation

The backend provides a comprehensive REST API:

- **Projects**: CRUD operations for project management
- **Reconnaissance**: Nmap and WhatWeb scan execution
- **Scan Results**: Result storage and retrieval
- **AI Assistant**: IBM Granite-powered analysis and chat
- **Notes**: Project documentation and findings

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
| `DATABASE_URL` | PostgreSQL connection string | Auto-generated |
| `SECRET_KEY` | JWT secret key for authentication | Random generated |
| `REPLICATE_API_TOKEN` | Replicate API key for IBM Granite AI | None |
| `CELERY_BROKER_URL` | Task queue broker URL | `memory://` |
| `NMAP_PATH` | Path to Nmap executable | `/usr/bin/nmap` |
| `ENVIRONMENT` | Application environment | `production` |

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

## 🗺️ Roadmap

- [ ] Advanced web application scanning
- [ ] Integration with additional reconnaissance tools
- [ ] Enhanced AI analysis capabilities
- [ ] Custom reporting and export features
- [ ] Team collaboration and sharing
- [ ] API rate limiting and monitoring
- [ ] Mobile-responsive improvements
- [ ] Extended IBM Granite AI features

---

**JustSploit** - Making penetration testing more efficient and accessible. 