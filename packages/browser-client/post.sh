#!/bin/bash
bun run build
./post ./dist/app.js aonyxbuddy $1 https://10.0.0.10/api/v1/apps
