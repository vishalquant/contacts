const sonarqubeScanner = require('sonarqube-scanner');
const serverUrl = process.env.sonar || 'http://localhost';
sonarqubeScanner(
  {
    serverUrl,
    options: {
      'sonar.sources': '.',
      'sonar.inclusions': '/**', // Entry point of your code
    },
  },
  () => {}
);
