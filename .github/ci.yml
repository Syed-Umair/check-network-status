name: Test and Release package

on:
  push:
    branches:
      - master
  schedule:
   - cron: '28 14 * * *'

jobs:
  build:
    runs-on: macOS-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: 12
      - run: npm ci
      - run: npm test
