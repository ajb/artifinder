artifinder
====

Find your most recent build artifacts on CircleCI. Given a build artifact URL like "https://circle-artifacts.com/gh/dobtco/dvl-flashes/2/artifacts/0/home/ubuntu/dvl-flashes/screenshots/error.png", artifinder will automatically replace the `build_num` with the most recent successful build and then proxy a request for that artifact, ensuring that the artifacts you're linking to are always up-to-date, and that you can keep your API token a secret.

## Usage

1. Fork & deploy to Heroku
2. Set environment variables for the CircleCI repos you'll be finding artifacts on: `heroku config:set ORGNAME_REPONAME_TOKEN=CIRCLE_TOKEN`
3. Find your build artifacts on Circle, and replace `https://circle-artifacts.com/` with `http://appname.herokuapp.com/`
4. ...?
5. Profit!

## License

MIT
