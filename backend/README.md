# Backend

## Graypaper Update Feature

This project includes an automated job that checks for new releases of the graypaper repository and updates the database with new versions.

The graypaper release check is integrated directly into the main application and runs as a cron job at midnight every day.

### How it works

1. The application uses node-cron to schedule the job
2. When triggered, it fetches latest releases from GitHub
3. Any new versions are added to the graypapers table in the database

### Manual update

If you need to run the graypaper update manually:

```
npx tsx src/scripts/updateGraypapers.ts
```

### Deployment

The application is ready for Heroku deployment with the npm start command:

```
npm start
```

This will start the main application which includes the scheduled graypaper update check. 