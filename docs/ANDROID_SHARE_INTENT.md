# Android Share Target (ACTION_SEND) Integration Architecture

This document outlines the technical specification and implementation pathway for enabling **ReelFetch** to appear in the native Android Share sheet when users tap "Share" within Instagram.

---

## 1. How Android Sharing Works

When a user in Instagram selects **Share > Share to...**, Android constructs an implicit intent:
- **Action:** `android.intent.action.SEND`
- **MIME Type:** `text/plain`
- **Extras:** `Intent.EXTRA_TEXT` (contains the URL, often accompanied by post captions or titles)

To register ReelFetch as an eligible receiver, Android requires an `<intent-filter>` registered under the app's `MainActivity` in `AndroidManifest.xml`.

---

## 2. Continuous Native Generation (CNG) & Expo Config Plugin

Per Expo and modern React Native architecture, `android/` and `ios/` folders are continuously generated (`npx expo prebuild` or EAS Build) rather than tracked directly in source control.

To ensure native configuration persistence:
1. We created the config plugin at `plugins/withAndroidShareIntent.js`.
2. When ready for development builds, register the plugin in `app.json`:
   ```json
   {
     "expo": {
       "plugins": [
         "expo-router",
         "./plugins/withAndroidShareIntent"
       ]
     }
   }
   ```
3. During prebuild, this injects the required block into `AndroidManifest.xml`:
   ```xml
   <activity android:name=".MainActivity" ...>
       <intent-filter>
           <action android:name="android.intent.action.SEND" />
           <category android:name="android.intent.category.DEFAULT" />
           <data android:mimeType="text/plain" />
       </intent-filter>
   </activity>
   ```

---

## 3. Receiving the Shared Text in JavaScript / TypeScript

### Launch Scenarios:
1. **Cold Start (App was closed):** Android creates `MainActivity` with the intent. The initial intent can be read via a Native Module or `Linking.getInitialURL()`.
2. **Warm Start (App was in background):** Android invokes `onNewIntent(Intent intent)`. The Native Module emits an event into JavaScript.

### Text Sanitization:
Instagram and YouTube frequently send shared payloads like:
> *"Check out this video: https://www.instagram.com/reel/C8xYz12345/ shared via Instagram"*

The app's URL validator in `src/utils/urlValidator.ts` extracts the HTTP/HTTPS link from the shared text block:
```ts
const urlRegex = /(https?:\/\/[^\s]+)/gi;
const match = rawSharedText.match(urlRegex);
if (match && match[0]) {
  const result = parseAndValidateUrl(match[0]);
  router.push({ pathname: '/preview', params: { url: result.normalizedUrl } });
}
```

---

## 4. Current Foundation Status

- ✅ **UI & Navigation:** Complete (Home, Link Preview, Downloads, Settings).
- ✅ **URL Validation & Normalization:** Complete (Instagram Reels, YouTube Shorts, malformed link rejection).
- ✅ **Config Plugin:** Created at `plugins/withAndroidShareIntent.js`.
- ⚠️ **Native Share Sheet Testing:** Requires a development build (`npx expo run:android` or EAS Build) with an Android device/emulator to test the OS share sheet. Expo Go alone does not execute arbitrary `ACTION_SEND` intents.
