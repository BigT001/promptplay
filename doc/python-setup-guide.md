# Python Environment Setup Guide

## Prerequisites
- Python 3.8 or higher installed
- pip (Python package installer)
- Windows PowerShell or Command Prompt with administrator privileges

## Step-by-Step Setup

### 1. Remove Existing Environment (if any)
```powershell
# If you have an existing environment, remove it
rm -r backend-env    # Windows PowerShell
# OR
rmdir /s /q backend-env    # Windows CMD
```

### 2. Create Fresh Virtual Environment
Navigate to the project root directory and create a new virtual environment:
```powershell
cd C:\Users\hp\Desktop\promptplay
python -m venv backend-env
```

### 3. Activate Virtual Environment
```powershell
# In PowerShell
.\backend-env\Scripts\Activate.ps1

# In CMD
.\backend-env\Scripts\activate.bat
```

### 4. Verify Python and pip
After activation, verify the Python installation:
```powershell
python --version
pip --version
```

### 5. Install Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 6. Verify FastAPI Installation
```powershell
python -c "import fastapi; print(fastapi.__version__)"
```

## Common Issues and Solutions

### 1. PowerShell Execution Policy
If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Path Issues
If Python/pip is not found, add Python to your PATH:
1. Open System Properties
2. Click "Environment Variables"
3. Add Python paths to System PATH:
   - C:\Users\[Username]\AppData\Local\Programs\Python\Python3x
   - C:\Users\[Username]\AppData\Local\Programs\Python\Python3x\Scripts

### 3. pip Installation
If pip is missing:
```powershell
python -m ensurepip --upgrade
```

## Running the Backend

### 1. Start FastAPI Server
```powershell
cd backend
uvicorn app.main:app --reload
```

### 2. Verify Server
Open browser and navigate to:
- http://localhost:8000/health
- http://localhost:8000/docs (Swagger Documentation)

## Development Workflow

1. Always activate the virtual environment before working:
```powershell
.\backend-env\Scripts\Activate.ps1
```

2. Install new dependencies:
```powershell
pip install [package-name]
pip freeze > requirements.txt
```

3. Run the server in development mode:
```powershell
uvicorn app.main:app --reload --port 8000
```