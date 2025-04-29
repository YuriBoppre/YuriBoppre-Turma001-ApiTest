module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.[jt]s?(x)'],
  verbose: true,
  testTimeout: 30000,
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './output',
        filename: 'report.html',
        pageTitle: 'Integration Tests with Jest and Pactum',
        expand: false,
        openReport: false
      }
    ]
  ]
};