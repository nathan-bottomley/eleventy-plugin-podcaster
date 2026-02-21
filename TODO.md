# TODO

## Warnings and errors for missing data

Add consistent warnings and errors when required data is missing. This should be opt-in via a plugin option to avoid a breaking change.

Behaviour:

- In development (`ELEVENTY_RUN_MODE === 'serve'`): log warnings but continue the build
- In production: throw errors and stop the build

Cases to handle:

- Missing `podcast.json` or required fields within it
- Episode post without a matching audio file
- Malformed episode numbering in filenames
- Incomplete S3 configuration (some keys but not others)
- Missing audio file when calculating duration/size

Implementation notes:

- Use a consistent prefix like `[podcaster]` so messages are identifiable
- New plugin option (e.g., `strictMode` or `validateData`) to enable this
- The draft system may already cover some cases (e.g., incomplete episodes marked as drafts)
