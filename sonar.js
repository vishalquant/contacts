const sonarqubeScanner = require('sonarqube-scanner');
const serverUrl = process.env.sonar || 'http://localhost';
sonarqubeScanner(
  {
    serverUrl,
    options: {
      'sonar.sources': '.',
      'sonar.inclusions': '/backend/**', // Entry point of your code
    },
  },
  () => {}
);
