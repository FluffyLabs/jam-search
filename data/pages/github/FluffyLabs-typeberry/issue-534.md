---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/534'
title: Implement target/max peer management with scoring system
site: github.com/FluffyLabs/typeberry
created_at: '2025-08-11T05:38:55.000Z'
last_modified: '2025-08-11T05:38:55.000Z'
content_kind: issue
---

# Implement target/max peer management with scoring system

## Issue by @coderabbitai[bot]

## Feature Request

Add support for managing peer connections with configurable target and maximum limits, along with a peer scoring system.

### Requirements

- **Discovery Process**: Attempt to discover as many peers as possible
- **Target Connections**: Connect to the `target` best peers based on their scores
- **Peer Scoring**: Track previously connected peers and maintain scores based on:
  - Helpfulness (quality of data provided)
  - Reliability (connection stability, response times)
- **Flexible Target**: Allow going over the `target` peer count when beneficial
- **Hard Maximum**: Enforce a `max` limit where:
  - Stop accepting any new connections when reached
  - Actively disconnect peers with the lowest scores to maintain the limit

### Context

This feature was discussed in PR #452: https://github.com/FluffyLabs/typeberry/pull/452#discussion_r2259395416

Requested by: @tomusdrw
