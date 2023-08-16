# Gomodoro
Simple ReactNative app for tracking time of your Todoist apps.

### Compatibility
- Only tested on iOS.

### Installation
```bash
yarn # Normally I advocate for npm, but for this project, yarn is less buggy.
```

### Development
- Using the terminal
  - Start the development server in a terminal window or tab.
    ```bash
    yarn start --reset-cache
    ```
  - Install / run the expo ap into the simulator.
    ```bash
    yarn run ios
    ```

- Using the [`Expo XDE`](https://github.com/expo/xde/releases).

### Deployment

- Start the expo server in a terminal window.
```bash
yarn start --reset-cache
```
- In another terminal window:
```bash
npm i -g exp # only if it's not installed already
exp login # only if you're not logged in already
exp build:ios # I've only tried letting expo manage credentials
# Answer the questions and download the ipa.
```
- Install or open `Application Loader` from itunes connect.
- Upload the generated IPA to either distribute it via TestFlight or submit it to the store.
