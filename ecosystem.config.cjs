module.exports = {
  apps: [
    {
      name: "epa_fe",
      script: "build/server.cjs",
      cwd: "./",
      autorestart: true,
      watch: false,
      env: {
        VITE_NODE_ENV: "production",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};