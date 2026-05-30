module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'backend',
      script: './venv/bin/python3', // 가상환경 파이썬 직접 지목
      args: '-m uvicorn main:app --host 0.0.0.0 --port 8080',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        PYTHONPATH: "."
      }
    }
  ]
};